<script setup lang="ts"></script>
<template>
  <section>
    <div class="content">
      <img src="@/assets/images/illustration.svg" alt="img" />
      <div class="text">
        <h1>Saytda texnik ishlar ketmoqda</h1>
        <p class="w-25">Axborot tizimida texnik ishlar olib borilmoqda!!!</p>
      </div>
    </div>
  </section>
</template>
<style lang="scss" scoped>
section {
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content {
  padding: 3rem 0;
  text-align: center;
  flex: 1;
}

.text {
  padding: 3.5rem 0;
}

.text h1 {
  font-size: 3rem;
  font-weight: bold;
}

.text p {
  font-size: 1.5625rem;
  font-weight: 400;
  min-width: 31.25rem;
  max-width: 100%;
  margin: 0 auto;
}

@media (max-width: 576px) {
  section.content img {
    width: 18.75rem;
  }

  .text h1 {
    font-size: 1.5625rem;
  }

  .text p {
    font-size: 0.875rem;
    font-weight: 400;
    min-width: 18.75rem;
  }
}
</style>
