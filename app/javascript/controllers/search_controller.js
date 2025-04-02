import { Controller } from "@hotwired/stimulus";
import debounce from "lodash/debounce";

export default class extends Controller {
  static targets = ["input", "results"];
  static values = { nextCursor: String };

  connect() {
    this.search = debounce(this.search.bind(this), 300);
  }

  search() {
    const query = this.inputTarget.value;
    const url = new URL(window.location.href);
    url.searchParams.set("query", query);
    url.searchParams.delete("after_cursor"); // Reset pagination on new search

    this.resultsTarget.classList.add("loading");
    fetch(url, {
      headers: { "Accept": "text/html" }
    })
      .then(response => response.text())
      .then(html => {
        this.resultsTarget.innerHTML = html;
        this.resultsTarget.classList.remove("loading");
      });
  }

  loadMore(event) {
    const button = event.currentTarget;
    const cursor = button.dataset.searchNextCursorValue;
    const url = new URL(window.location.href);
    url.searchParams.set("after_cursor", cursor);

    fetch(url, {
      headers: { "Accept": "text/html" }
    })
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const newResults = doc.querySelector("[data-search-target='results']").innerHTML;
        const newButton = doc.querySelector("button[data-action='click->search#loadMore']");

        this.resultsTarget.insertAdjacentHTML("beforeend", newResults);
        if (newButton) {
          button.parentElement.replaceChild(newButton, button);
        } else {
          button.remove();
        }
      });
  }
}