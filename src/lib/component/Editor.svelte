<style global>
  .ProseMirror {
    padding: 0;
    min-height: 100%;
    outline: none;
    border: none;
    margin: 0.5rem;
    min-height: 100%;
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
      on:click="{() => editor.chain().focus().toggleItalic().run()}"
      class:bg-glass="{editor.isActive('italic')}"
      class:text-primary="{editor.isActive('italic')}"
      use:tooltip="{['İtalik', { placement: 'bottom' }]}">
      <i>I</i>
    </button>
    <button
      class="btn btn-small small"
      on:click="{() => editor.chain().focus().toggleUnderline().run()}"
      class:bg-glass="{editor.isActive('underline')}"
      class:text-primary="{editor.isActive('underline')}"
      use:tooltip="{['Altı Çizili', { placement: 'bottom' }]}">
      <u>U</u>
    </button>
    <button
      class="btn btn-small small"
      on:click="{() => editor.chain().focus().toggleStrike().run()}"
      class:bg-glass="{editor.isActive('strike')}"
      class:text-primary="{editor.isActive('strike')}"
      use:tooltip="{['Üstü Çizili', { placement: 'bottom' }]}">
      <s>S</s>
    </button>

    <!-- Lists -->
    <button
      class="btn btn-small small"
      on:click="{() => editor.chain().focus().toggleBulletList().run()}"
      class:bg-glass="{editor.isActive('bulletList')}"
      class:text-primary="{editor.isActive('bulletList')}"
      use:tooltip="{['Liste', { placement: 'bottom' }]}">
      <i class="fas fa-list"></i>
    </button>
    <button
      class="btn btn-small small"
      on:click="{() => editor.chain().focus().toggleOrderedList().run()}"
      class:bg-glass="{editor.isActive('orderedList')}"
      class:text-primary="{editor.isActive('orderedList')}"
      use:tooltip="{['Sırali Liste', { placement: 'bottom' }]}">
      <i class="fas fa-list-ol"></i>
    </button>

    <!-- Media -->
    <button
      class="btn btn-small small"
      on:click="{addImage}"
      use:tooltip="{['Resim', { placement: 'bottom' }]}">
      <i class="fas fa-image"></i>
    </button>
    <button
      class="btn btn-small small"
      on:click="{setLink}"
      use:tooltip="{['Bağlantı', { placement: 'bottom' }]}"
      class:bg-glass="{editor.isActive('link')}"
      class:text-primary="{editor.isActive('link')}">
      <i class="fas fa-link"></i>
    </button>
    <button
      class="btn btn-small small"
      on:click="{openColorPicker}"
      use:tooltip="{['Yazı Rengi', { placement: 'bottom' }]}">
      <i
        class="fas fa-tint"
        style="{editor.getAttributes('textStyle').color &&
          'color:' + editor.getAttributes('textStyle').color + ';'}"></i>
    </button>

    <input
      type="color"
      bind:this="{colorPickerElement}"
      value="{editor.getAttributes('textStyle').color}"
      on:input="{(event) =>
        editor.chain().focus().setColor(event.target.value).run()}"
      hidden />

    <button
      class="btn btn-small small"
      on:click="{() => editor.chain().focus().unsetColor().run()}"
      use:tooltip="{['Yazı Rengini Kaldır', { placement: 'bottom' }]}">
      <i class="fas fa-tint-slash"></i>
    </button>
  </div>
{/if}

<!-- Editor Content -->
<div class="border border-top-0 rounded-bottom p-1" style="min-height: 100%;">
  <div bind:this="{element}"></div>
</div>

<script>
  import { onMount, onDestroy } from "svelte";

  import { Editor } from "@tiptap/core";
  import StarterKit from "@tiptap/starter-kit";
  import Underline from "@tiptap/extension-underline";
  import Link from "@tiptap/extension-link";
  import Image from "@tiptap/extension-image";
  import TextStyle from "@tiptap/extension-text-style";
  import Color from "@tiptap/extension-color";

  import tooltip from "$lib/tooltip.util";

  let element;
  let colorPickerElement;
  let editor;
  let editorContent = "";

  export let content = "";
  export let isEmpty = true;

  $: {
    if (editor && editorContent !== content) {
      editor.commands.setContent(content);
    }
  }

  function openColorPicker() {
    colorPickerElement.click();
  }

  function addImage() {
    const url = window.prompt("URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }

  function setLink() {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  onMount(() => {
    editor = new Editor({
      element: element,
      extensions: [
        StarterKit,
        Underline,
        Link.configure({
          openOnClick: false,
        }),
        Image,
        TextStyle,
        Color,
      ],
      content: content,
      onTransaction: () => {
        // force re-render so `editor.isActive` works as expected
        editor = editor;
      },
      onUpdate: ({ editor }) => {
        content = editor.getHTML();
        editorContent = editor.getHTML();
        isEmpty = editor.isEmpty;
      },
      onCreate: ({ editor }) => {
        content = editor.getHTML();
        editorContent = editor.getHTML();
        isEmpty = editor.isEmpty;
      },
    });
  });

  onDestroy(() => {
    if (editor) {
      editor.destroy();
    }
  });
</script>
