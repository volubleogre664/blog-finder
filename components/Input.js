import app from "../main.js";
import { execute, prepareSearchQuery } from "../helpers/searchHelper.js";

app.component("my-input", {
  /* HTML */
  template: `
  <form id="search__formID" class="search__bar search__form" style="border-radius: 20px" @submit.prevent="onSubmit">
    <input
      type="text"
      id="search-input"
      style="color: #fff"
      placeholder="Find your blog"
      v-model="searchStr"
    />

    <button @click="clearInput" type="reset" class="clear__input">X</button>
    <span class="separator"></span>
    <button class="submit__search" type="submit">
      <i class="fas fa-search"></i>
    </button>

    </form>
    `,

  data() {
    return {
      start: 1,
      searchStr: "",
      prevFilter: "",
      totalResults: 0,
      searchFiltter: "",
    };
  },

  methods: {
    async onSubmit(e) {
      const { isNewSearch, start } = prepareSearchQuery(
        this.searchStr,
        true,
        this.start
      );
      this.start = start;

      this.$emit(
        "push-to-blogs",
        await execute({
          query: this.searchStr,
          filter: this.searchFiltter,
          start,
        })
      );
    },

    clearInput() {
      this.searchStr = "";
    },
  },
});
