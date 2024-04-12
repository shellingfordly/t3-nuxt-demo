<script setup lang="ts">
import { useGithubCommentStore } from "../stores/githubComment";

const emit = defineEmits<{
  update: [comment: GithubCommentItem];
  cancel: [void];
}>();
const props = defineProps<{ commentId?: string; commentBody?: string }>();
const isUpdateComment = computed(() => !!props.commentId);
const githubCommentStore = useGithubCommentStore();
const createLoading = ref(false);
const content = ref("");
const editorRef = ref<HTMLTextAreaElement | null>(null)
const isFocus = ref(false);
const btnDisabled = computed<boolean>(()=>createLoading.value || !content.value || !githubCommentStore.isAuthed)

useEventListener(
  "click",
  () => {
    const focus = document.activeElement == editorRef.value;
    if(focus) onFocus()
    else isFocus.value = false;
  },
  false
);

watch(() => githubCommentStore.quoteCommentContent, (content) => {
  if (content) onFocus()
}, { immediate: true })

watchEffect(() => {
  if (props.commentBody) {
    content.value = props.commentBody;
  }
});

function onFocus() {
  if (editorRef.value) {
    editorRef.value.focus();
    isFocus.value = true;
  }
}

async function createComment() {
  const success = await githubCommentStore.createComment(content.value, "");
  if (success) {
    await githubCommentStore.initComments();
  }
  content.value = "";
}

async function updateComment() {
  if (props?.commentId) {
    const data = await githubCommentStore.editorComment(props?.commentId, content.value);

    if (data) {
      emit("update", data);
      githubCommentStore.onUpdateComment(data);
    }
  }
}

async function onEditComment() {
  createLoading.value = true;

  if (isUpdateComment.value) updateComment();
  else createComment();

  createLoading.value = false;
}
</script>
<template>
  <div
    class="w-full h-30 box-border p2 b-default rounded resize-none"
    :class="isFocus && 'b-2 b-blue dark:b-blue-800'"
    @click="onFocus"
  >
    <div
      v-if="githubCommentStore.quoteCommentContent"
      class="markdown-body mb2 bg-gray-100! p2 rounded"
      v-html="githubCommentStore.quoteCommentContent"
    />
    <textarea
      ref="editorRef"
      v-model="content"
      class="box-border w-full h-full resize-none b-0 outline-0"
      @focus="isFocus = true"
    />
  </div>
  <div flex-center-end p2 space-x-2>
    <button v-if="isUpdateComment" btn-red @click="$emit('cancel')">
      Cancel
    </button>

    <button
      btn
      cursor-not-allowed="createLoading && !content"
      :class="[btnDisabled && 'cursor-not-allowed!']"
      :disabled="btnDisabled"
      @click="onEditComment"
      title="post comment"
    >
      <span v-if="createLoading" i-line-md:loading-alt-loop />
      <span>{{ isUpdateComment ? "Update Comment" : "Comment" }}</span>
    </button>
  </div>
</template>
