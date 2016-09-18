AFRAME.registerComponent('projectile', {
  schema: {
    speed: { default: -0.4 }
  },
  tick: function () {
    this.el.object3D.translateY(this.data.speed);
  }
});

AFRAME.registerComponent('spawner', {
  schema: {
    on: { default: 'click' },
    mixin: { default: '' }
  },
  /**
   * Add event listener.
   */
  update: function (oldData) {
    this.el.addEventListener(this.data.on, this.spawn.bind(this));
  },
  /**
   * Spawn new entity at entity's current position.
   */
  spawn: function () {
    var el = this.el;
    var entity = document.createElement('a-entity');
    var matrixWorld = el.object3D.matrixWorld;
    var position = new THREE.Vector3();
    var rotation = el.getAttribute('rotation');
    var entityRotation;
    position.setFromMatrixPosition(matrixWorld);
    entity.setAttribute('position', position);
    // Have the spawned entity face the same direction as the entity.
    // Allow the entity to further modify the inherited rotation.
    position.setFromMatrixPosition(matrixWorld);
    entity.setAttribute('position', position);
    entity.setAttribute('mixin', this.data.mixin);
    entity.addEventListener('loaded', function () {
      entityRotation = entity.getComputedAttribute('rotation');
      entity.setAttribute('rotation', {
        x: entityRotation.x + rotation.x,
        y: entityRotation.y + rotation.y,
        z: entityRotation.z + rotation.z
      });
    });
    el.sceneEl.appendChild(entity);
  }
});

AFRAME.registerComponent('click-listener', {
  init: function () {
    var el = this.el;
    window.addEventListener('click', function () {
      el.emit('click', null, false);
    });
  }
});
