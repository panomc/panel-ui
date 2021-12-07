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
      class:text-primary="{editor.isActive('heading', { level: 1 })}">
      H1
    </button>
    <button
      class="btn btn-small small"
      on:click="{() =>
        editor.chain().focus().toggleHeading({ level: 2 }).run()}"
      class:glass="{editor.isActive('heading', { level: 2 })}"
      class:text-primary="{editor.isActive('heading', { level: 1 })}">
      H2
    </button>
    <button
      class="btn btn-small small"
      on:click="{() =>
        editor.chain().focus().toggleHeading({ level: 3 }).run()}"
      class:glass="{editor.isActive('heading', { level: 3 })}"
      class:text-primary="{editor.isActive('heading', { level: 3 })}">
      H3
    </button>

    <!-- Text Formatting -->
    <button
      class="btn btn-small small"
      on:click="{() => editor.chain().focus().setParagraph().run()}"
      class:glass="{editor.isActive('paragraph')}"
      class:text-primary="{editor.isActive('heading', { level: 1 })}">
      <b>B</b>
    </button>
    <button
      class="btn btn-small small"
      on:click="{() => editor.chain().focus().setParagraph().run()}"
      class:glass="{editor.isActive('paragraph')}"
      class:text-primary="{editor.isActive('heading', { level: 1 })}">
      <i>I</i>
    </button>
    <button
      class="btn btn-small small"
      on:click="{() => editor.chain().focus().setParagraph().run()}"
      class:glass="{editor.isActive('paragraph')}"
      class:text-primary="{editor.isActive('heading', { level: 1 })}">
      <u>U</u>
    </button>
    <button
      class="btn btn-small small"
      on:click="{() => editor.chain().focus().setParagraph().run()}"
      class:glass="{editor.isActive('paragraph')}"
      class:text-primary="{editor.isActive('heading', { level: 1 })}">
      <s>S</s>
    </button>

    <!-- Lists -->
    <button
      class="btn btn-small small"
      on:click="{() => editor.chain().focus().setParagraph().run()}"
      class:glass="{editor.isActive('paragraph')}"
      class:text-primary="{editor.isActive('heading', { level: 1 })}">
      <i class="fas fa-list"></i>
    </button>
    <button
      class="btn btn-small small"
      on:click="{() => editor.chain().focus().setParagraph().run()}"
      class:glass="{editor.isActive('paragraph')}"
      class:text-primary="{editor.isActive('heading', { level: 1 })}">
      <i class="fas fa-list-ol"></i>
    </button>

    <!-- Media -->
    <button
      class="btn btn-small small"
      on:click="{() => editor.chain().focus().setParagraph().run()}"
      class:glass="{editor.isActive('paragraph')}"
      class:text-primary="{editor.isActive('heading', { level: 1 })}">
      <i class="fas fa-image"></i>
    </button>
    <button
      class="btn btn-small small"
      on:click="{() => editor.chain().focus().setParagraph().run()}"
      class:glass="{editor.isActive('paragraph')}"
      class:text-primary="{editor.isActive('heading', { level: 1 })}">
      <i class="fas fa-link"></i>
    </button>
  </div>
{/if}

<!-- Editor Content -->
<div class="border border-top-0 rounded-bottom p-1 h-100" bind:this="{element}">
</div>

<script>
  import { onMount, onDestroy } from "svelte";
  import { Editor } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";

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
    });
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });
</script>
