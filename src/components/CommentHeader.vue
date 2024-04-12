<script setup lang="ts">
import { useGithubCommentStore } from "../stores/githubComment";

// const content = ref("");
const githubCommentStore = useGithubCommentStore();
const user = computed(() => githubCommentStore.userInfo);
const show = ref(false);


useEventListener(
  "click",
  () => {
    if (show.value) show.value = false;
  },
  false

);

function onShow(e: Event) {
  e.stopPropagation();
  show.value = true
}


function onLogin() {
  githubCommentStore.loginAuthorize();
}

function onLogout() {
  githubCommentStore.logout();
}
</script>
<template>
  <div flex>
    <div class="flex-center-center w-12 h-12 mr4 font-size-10 c-gray-500 dark:c-gray-300 cursor-pointer" title="Login">
      <span v-if="!githubCommentStore.isAuthed" i-mdi:github @click="onLogin" />
      <div v-else relative>
        <img class="w-10 h-10 rd-10" v-lazy="user.avatarUrl" @click="onShow" />
        <!-- Dropdown menu -->
        <div v-show="show"
          class="absolute top-0 left-12 z-10 text-sm b-default bg-white dark:bg-[#232323] divide-y dark:divide-gray-700 rounded-lg shadow">
          <div class="px-4 py-3 text-sm text-gray-900 dark:text-white">
            <span>{{ user.login }}</span>
            <span v-if="user.email"> {{ user.email }}</span>
          </div>
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="avatarButton">
            <li>
              <a :href="user.url" class="block px-4 py-2 hbg-gray">
                Github
              </a>
            </li>
          </ul>

          <div class=" py-1">
            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hbg-gray" @click="onLogout">
              Sign out
            </a>
          </div>
        </div>
      </div>
    </div>

    <div flex-1>
      <h4 font-size-4 font-500 mb3>Add a comment</h4>
      <CommentEditor />
    </div>
  </div>

</template>
