import app from "../main.js";

app.component("source-pill", {
  props: {
    source: {
      type: Object,
      required: true,
    },

    selected: {
      type: Boolean,
    },
  },

  /* HTML */
  template: `
    <span 
        :class="{ active: selected }"
        @click="onClick"
    >
        {{ source.name }}
    </span>
`,

  data() {
    return {};
  },

  methods: {
    onClick() {
      this.$emit("pill-click", this.source.url);
    },
  },
});
