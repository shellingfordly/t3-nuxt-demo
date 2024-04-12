<script setup lang="ts">
import { useGithubCommentStore } from "../stores/githubComment";

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
    <div class="flex-center-center w-12 h-12 mr4">
      <div v-if="!githubCommentStore.isAuthed"
        class="flex-center-center w-11 h-11 overflow-hidden b-2 rd-full cursor-pointer b-gray-200 dark:b-gray-700"
        @click="onLogin" title="Login">
        <div class="flex-center-center w-9 h-9 rd-full bg-gray-200 dark:bg-gray-700">
          <span class="font-size-2.5 c-gray-500 dark:c-gray-300">Login</span>
        </div>
      </div>
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
