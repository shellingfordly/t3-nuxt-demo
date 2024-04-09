<script setup lang="ts">
import { SignInButton, UserButton, useUser } from "vue-clerk";

const user = useUser();
</script>

<template>
  <SignInButton v-if="!user.isSignedIn" />
  <UserButton v-else />
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
