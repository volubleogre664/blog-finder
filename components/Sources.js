import app from "../main.js";
import { applyFilter } from "../helpers/searchHelper.js";

app.component("blog-sources", {
  props: {
    sources: {
      type: Array,
      required: true,
    },

    searchStr: {
      type: String,
    },
  },

  /* HTML */
  template: `
        <details>
            <summary>Filter Search: {{ this.selected }}</summary>
            <div class="search__filters">
                <source-pill
                    v-for="(source, index) in sources"
                    :key="index"
                    :selected="source.url === selected"
                    @pill-click="onPillClick"
                    :source="source">
                </source-pill>
            </div>
        </details>
    `,

  data() {
    return {
      selected: "",
    };
  },

  methods: {
    onPillClick(sourceUrl) {
      this.selected = sourceUrl;
      console.log("Sources File: ", this.searchStr);
      this.$emit("push-to-blogs", applyFilter(this.searchStr, sourceUrl));
    },
  },
});
