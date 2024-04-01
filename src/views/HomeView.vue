<template>
  <main>
    <div id="hero">
      <canvas id="hero-canvas"></canvas>
    </div>
  </main>
</template>
<script>
import SceneController from '../scenes/template.scene'
export default {
  name: 'HomeView',
  async mounted() {
    // wait for the next tick so the canvas has time to render, then execute the scene
    await this.$nextTick()
    const heroScene = new SceneController(document.getElementById('hero-canvas'))
    heroScene.spawn()
  }
}
</script>
<style>
#hero {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 2rem;
}
#hero-canvas {
  width: 100%;
  aspect-ratio: 1 / 1;
}

@media (min-width: 1024px) {
  #hero {
    justify-content: center;
    padding-top: 0;
  }
}
</style>
