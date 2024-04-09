<script setup lang="ts">
const comments = ref<any[]>([]);

onMounted(async () => {
  const { data } = await useFetch(
    "https://api.github.com/repos/shellingfordly/vue-comment/issues/1/comments",
    {
      headers: {
        Authorization: "token " + import.meta.env.VITE_GITHUB_TOKEN,
      },
    }
  ).get();
  console.log(JSON.parse(data.value as string));
  comments.value = JSON.parse(data.value as string) as any[];
});
</script>
<template>
  <div>
    <ul>
      <li v-for="comment in comments">
        <CommentItem
          :comment="comment"
          :id="comment.number"
          :user="comment.user"
        />
      </li>
    </ul>
  </div>
</template>
<style scoped></style>
