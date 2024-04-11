<script setup lang="ts">
const show = ref(false)


function onClickShow(event: Event) {
  event.stopPropagation();

  show.value = !show.value;
}

useEventListener(
  "click",
  () => {
    if (show.value) show.value = false;
  },
  false
);
</script>
<template>
  <div relative>
    <span hc-blue i-material-symbols:more-horiz @click="onClickShow"></span>

    <!-- Dropdown menu -->
    <div v-if="show"
      class="absolute left--28 w-35 z-10 text-sm b-default bg-white dark:bg-[#232323] divide-y dark:divide-gray-700 rounded-lg shadow">
      <ul class="py-2">
        <li>
          <a href="#" class="block px-4 py-2 hbg-gray">
            Copy link
          </a>
        </li>
        <li>
          <a href="#" class="block px-4 py-2 hbg-gray">
            Quote reply
          </a>
        </li>
      </ul>
      <div class="py-2">
        <a href="#" class="block px-4 py-2 text-sm hbg-gray ">
          Edit
        </a>
        <a href="#" class="block px-4 py-2 text-sm hbg-gray">
          Hide
        </a>
        <a href="#" class="block px-4 py-2 text-sm c-red hover:c-white hover:bg-red">
          Delete
        </a>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
