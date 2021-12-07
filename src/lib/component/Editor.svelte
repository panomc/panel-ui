<style global>
  .ProseMirror {
    padding: 0;
    height: 100%;
    outline: none;
    border: none;
    margin: 0.5rem;
  }

  .ProseMirror p {
    margin: 5px;
  }
</style>

{#if editor}
  <div class="p-1 border rounded-top">
    <!-- Headings -->
    <button
      class="btn btn-small small"
      on:click="{() =>
        editor.chain().focus().toggleHeading({ level: 1 }).run()}"
      class:bg-glass="{editor.isActive('heading', { level: 1 })}"
      class:text-primary="{editor.isActive('heading', { level: 1 })}"
      use:tooltip="{['Başlık 1', { placement: 'bottom' }]}">
      H1
    </button>
    <button
      class="btn btn-small small"
      on:click="{() =>
        editor.chain().focus().toggleHeading({ level: 2 }).run()}"
      class:bg-glass="{editor.isActive('heading', { level: 2 })}"
      class:text-primary="{editor.isActive('heading', { level: 2 })}"
      use:tooltip="{['Başlık 2', { placement: 'bottom' }]}">
      H2
    </button>
    <button
      class="btn btn-small small"
      on:click="{() =>
        editor.chain().focus().toggleHeading({ level: 3 }).run()}"
      class:bg-glass="{editor.isActive('heading', { level: 3 })}"
      class:text-primary="{editor.isActive('heading', { level: 3 })}"
      use:tooltip="{['Başlık 3', { placement: 'bottom' }]}">
      H3
    </button>

    <!-- Text Formatting -->
    <button
      class="btn btn-small small"
      on:click="{() => editor.chain().focus().toggleBold().run()}"
      class:bg-glass="{editor.isActive('bold')}"
      class:text-primary="{editor.isActive('bold')}"
      use:tooltip="{['Kalın', { placement: 'bottom' }]}">
      <b>B</b>
    </button>
    <button
      class="btn btn-small small"
      on:click="{() => editor.chain().focus().setParagraph().run()}"
      class:bg-glass="{editor.isActive('paragraph')}"
      class:text-primary="{editor.isActive('heading', { level: 1 })}"
      use:tooltip="{['İtalik', { placement: 'bottom' }]}">
      <i>I</i>
    </button>
    <button
      class="btn btn-small small"
      on:click="{() => editor.chain().focus().setParagraph().run()}"
      class:bg-glass="{editor.isActive('paragraph')}"
      class:text-primary="{editor.isActive('heading', { level: 1 })}"
      use:tooltip="{['Altı Çizili', { placement: 'bottom' }]}">
      <u>U</u>
    </button>
    <button
      class="btn btn-small small"
      on:click="{() => editor.chain().focus().setParagraph().run()}"
      class:bg-glass="{editor.isActive('paragraph')}"
      class:text-primary="{editor.isActive('heading', { level: 1 })}"
      use:tooltip="{['Üstü Çizili', { placement: 'bottom' }]}">
      <s>S</s>
    </button>

    <!-- Lists -->
    <button
      class="btn btn-small small"
      on:click="{() => editor.chain().focus().setParagraph().run()}"
      class:bg-glass="{editor.isActive('paragraph')}"
      class:text-primary="{editor.isActive('heading', { level: 1 })}"
      use:tooltip="{['Liste', { placement: 'bottom' }]}">
      <i class="fas fa-list"></i>
    </button>
    <button
      class="btn btn-small small"
      on:click="{() => editor.chain().focus().setParagraph().run()}"
      class:bg-glass="{editor.isActive('paragraph')}"
      class:text-primary="{editor.isActive('heading', { level: 1 })}"
      use:tooltip="{['Sırali Liste', { placement: 'bottom' }]}">
      <i class="fas fa-list-ol"></i>
    </button>

    <!-- Media -->
    <button
      class="btn btn-small small"
      on:click="{() => editor.chain().focus().setParagraph().run()}"
      class:bg-glass="{editor.isActive('paragraph')}"
      class:text-primary="{editor.isActive('heading', { level: 1 })}"
      use:tooltip="{['Resim', { placement: 'bottom' }]}">
      <i class="fas fa-image"></i>
    </button>
    <button
      class="btn btn-small small"
      on:click="{() => editor.chain().focus().setParagraph().run()}"
      class:bg-glass="{editor.isActive('paragraph')}"
      class:text-primary="{editor.isActive('heading', { level: 1 })}"
      use:tooltip="{['Bağlantı', { placement: 'bottom' }]}">
      <i class="fas fa-link"></i>
    </button>
    <button
      class="btn btn-small small"
      on:click="{() => editor.chain().focus().setParagraph().run()}"
      class:bg-glass="{editor.isActive('paragraph')}"
      class:text-primary="{editor.isActive('heading', { level: 1 })}"
      use:tooltip="{['Yazı Rengi', { placement: 'bottom' }]}">
      <i class="fas fa-palette"></i>
    </button>
  </div>
{/if}

<!-- Editor Content -->
<div class="border border-top-0 rounded-bottom p-1 h-100" bind:this="{element}">
</div>

<script>
  import { onMount, onDestroy, createEventDispatcher } from "svelte";

  import { Editor } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";

  import tooltip from "$lib/tooltip.util";

  const dispatch = createEventDispatcher();

  let element;
  let editor;

  export let content = "";

  onMount(() => {
    editor = new Editor({
      element: element,
      extensions: [StarterKit],
      content: content,
      onTransaction: () => {
        // force re-render so `editor.isActive` works as expected
        editor = editor;
      },
      onUpdate: ({ editor }) => {
        dispatch("contentChange", {
          content: editor.getHTML(),
          isEmpty: editor.isEmpty,
        });
      },
      onCreate: ({ editor }) => {
        dispatch("contentChange", {
          content: editor.getHTML(),
          isEmpty: editor.isEmpty,
        });
      },
    });
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });
</script>
