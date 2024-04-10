<script setup lang="ts">
const isDark = useDark();
</script>

<template>
  <div p10>
    <button mb5 btn @click="isDark = !isDark">change theme</button>

    <!-- <HelloWorld /> -->
    <CommentEditor />
    <CommentList />
  </div>
</template>
