// main script
(function () {
  "use strict";

  // Dropdown Menu Toggler For Mobile
  // ----------------------------------------
  const dropdownMenuToggler = document.querySelectorAll(
    ".nav-dropdown > .nav-link",
  );

  dropdownMenuToggler.forEach((toggler) => {
    toggler?.addEventListener("click", (e) => {
      e.target.closest(".nav-item").classList.toggle("active");
    });
  });

  // Testimonial Slider
  // ----------------------------------------
  new Swiper(".testimonial-slider", {
    spaceBetween: 24,
    loop: true,
    pagination: {
      el: ".testimonial-slider-pagination",
      type: "bullets",
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      992: {
        slidesPerView: 3,
      },
    },
  });
  // Card title inline ellipsis (binary search for exact fit)
  // ----------------------------------------
  document.querySelectorAll(".card-title").forEach((link) => {
    if (link.closest("[data-card-title-wrap]")) {
      link.style.overflow = "";
      link.style.whiteSpace = "";
      return;
    }

    link.style.overflow = "hidden";
    link.style.whiteSpace = "nowrap";

    if (link.scrollWidth <= link.clientWidth) {
      link.style.overflow = "";
      link.style.whiteSpace = "";
      return;
    }

    const fullText = link.textContent.trim();
    let lo = 0, hi = fullText.length;

    while (lo < hi - 1) {
      const mid = Math.floor((lo + hi) / 2);
      link.textContent = fullText.slice(0, mid) + "...";
      if (link.scrollWidth <= link.clientWidth) {
        lo = mid;
      } else {
        hi = mid;
      }
    }

    link.textContent = fullText.slice(0, lo).trimEnd();

    const ellipsis = document.createElement("span");
    ellipsis.textContent = "...";
    ellipsis.className = "cursor-pointer text-text-light hover:text-text-dark dark:text-darkmode-text-light dark:hover:text-darkmode-text-dark";
    ellipsis.addEventListener("click", (e) => {
      e.preventDefault();
      link.textContent = fullText;
      link.style.overflow = "";
      link.style.whiteSpace = "";
    });
    link.appendChild(ellipsis);
  });

  // Clickable cards
  // ----------------------------------------
  document.querySelectorAll("[data-card-link]").forEach((card) => {
    card.addEventListener("click", (event) => {
      const interactive = event.target.closest(
        "a, button, input, select, textarea, summary, [role='button']",
      );

      if (interactive) return;

      const href = card.dataset.cardLink;
      if (href) {
        window.location.href = href;
      }
    });
  });

  // List view toggle
  // ----------------------------------------
  document.querySelectorAll("[data-list-view-root]").forEach((root, index) => {
    const toggleButton = root.querySelector("[data-list-view-toggle-button]");
    const viewLabel = root.querySelector("[data-list-view-label]");
    const icon = root.querySelector("[data-list-view-icon]");
    const viewKey = root.dataset.listViewKey || `list-${index}`;
    const storageKey = `listView:v2:${viewKey}`;

    if (!toggleButton) return;

    const applyListView = (view) => {
      const isCompact = view === "compact";

      root.dataset.listView = isCompact ? "compact" : "full";
      toggleButton.classList.toggle("home-view-icon-button-active", isCompact);
      toggleButton.setAttribute("aria-pressed", isCompact ? "true" : "false");
      toggleButton.setAttribute(
        "aria-label",
        isCompact ? "Switch to full view" : "Switch to compact view",
      );
      toggleButton.setAttribute(
        "title",
        isCompact ? "Switch to full view" : "Switch to compact view",
      );

      if (viewLabel) {
        viewLabel.textContent = isCompact ? "Compact" : "Full";
      }

      if (icon) {
        icon.className = isCompact
          ? "fa-solid fa-list-ul"
          : "fa-solid fa-table-cells-large";
      }

      try {
        window.localStorage.setItem(storageKey, view);
      } catch (_error) {
        // Ignore storage issues and keep the current session state only.
      }
    };

    let initialView = "full";
    try {
      initialView = window.localStorage.getItem(storageKey) || "full";
    } catch (_error) {
      initialView = "full";
    }

    applyListView(initialView === "compact" ? "compact" : "full");

    toggleButton.addEventListener("click", () => {
      const buttonTop = toggleButton.getBoundingClientRect().top;
      applyListView(root.dataset.listView === "compact" ? "full" : "compact");
      const newButtonTop = toggleButton.getBoundingClientRect().top;
      window.scrollBy(0, newButtonTop - buttonTop);
    });
  });

  // Additive filters
  // ----------------------------------------
  document.querySelectorAll("[data-filter-root]").forEach((root) => {
    const clearUrl = root.dataset.filterClearUrl || window.location.pathname;
    const filterPanel = root.querySelector("[data-filter-panel]");
    const clearButton = root.querySelector("[data-clear-filters]");
    const activeSummary = root.querySelector("[data-active-filters-summary]");
    const controls = Array.from(
      root.querySelectorAll("[data-filter-kind][data-filter-value]"),
    );
    const items = Array.from(root.querySelectorAll("[data-filter-item]"));
    const groups = Array.from(root.querySelectorAll("[data-filter-group]"));
    const emptyState = root.querySelector("[data-filter-empty]");
    const kinds = ["categories", "tags", "authors"];

    const parseValues = (value) =>
      (value || "")
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean);

    const parseItemValues = (value) =>
      (value || "")
        .split("|")
        .map((entry) => entry.trim())
        .filter(Boolean);

    const readSelected = () => {
      const params = new URLSearchParams(window.location.search);
      return kinds.reduce((acc, kind) => {
        const queryValues = params.getAll(kind);
        const initialValues =
          queryValues.length > 0
            ? []
            : parseValues(root.dataset[`filterInitial${kind[0].toUpperCase()}${kind.slice(1)}`]);
        acc[kind] = new Set(
          [...queryValues, ...initialValues]
            .flatMap((value) => value.split(","))
            .map((value) => value.trim())
            .filter(Boolean),
        );
        return acc;
      }, {});
    };

    const getInitialSelections = () =>
      kinds.reduce((acc, kind) => {
        acc[kind] = parseValues(
          root.dataset[`filterInitial${kind[0].toUpperCase()}${kind.slice(1)}`],
        );
        return acc;
      }, {});

    const buildQuery = (selected) => {
      const params = new URLSearchParams();

      kinds.forEach((kind) => {
        Array.from(selected[kind]).forEach((value) => {
          params.append(kind, value);
        });
      });

      return params.toString();
    };

    const updateUrl = (selected, basePath = window.location.pathname) => {
      const query = buildQuery(selected);
      const targetUrl = query ? `${basePath}?${query}` : clearUrl;
      window.history.replaceState({}, "", targetUrl);
    };

    const hasAnySelection = (selected) =>
      kinds.some((kind) => selected[kind] && selected[kind].size > 0);

    const syncPanel = (selected) => {
      const active = hasAnySelection(selected);
      const activeLabels = kinds.flatMap((kind) => {
        const seen = new Set();
        return controls
          .filter((control) => {
            if (control.dataset.filterKind !== kind) return false;
            if (!selected[kind]?.has(control.dataset.filterValue)) return false;
            if (seen.has(control.dataset.filterValue)) return false;
            seen.add(control.dataset.filterValue);
            return true;
          })
          .map((control) => control.textContent.replace(/\(\d+\)/, "").trim());
      });

      if (clearButton) {
        clearButton.classList.toggle("hidden", !active);
      }

      if (activeSummary) {
        activeSummary.textContent = activeLabels.join(", ");
        activeSummary.classList.toggle("hidden", !active);
      }
    };

    const syncControls = (selected) => {
      controls.forEach((control) => {
        const isActive = selected[control.dataset.filterKind]?.has(
          control.dataset.filterValue,
        );
        control.classList.toggle("ui-chip-active", Boolean(isActive));
        control.classList.toggle("text-text-dark", Boolean(isActive));
        control.classList.toggle("dark:text-darkmode-text-dark", Boolean(isActive));
      });
    };

    const applyFilters = (selected) => {
      let visibleCount = 0;
      const activeSelections = kinds.flatMap((kind) =>
        Array.from(selected[kind] || []).map((value) => ({ kind, value })),
      );

      items.forEach((item) => {
        const matches =
          activeSelections.length === 0 ||
          activeSelections.some(({ kind, value }) => {
            const itemValues = parseItemValues(
              item.dataset[`filter${kind[0].toUpperCase()}${kind.slice(1)}`],
            );
            return itemValues.includes(value);
          });

        item.classList.toggle("hidden", !matches);
        if (matches) visibleCount += 1;
      });

      groups
        .slice()
        .reverse()
        .forEach((group) => {
          const hasVisibleItems =
            group.querySelectorAll("[data-filter-item]:not(.hidden)").length > 0;
          group.classList.toggle("hidden", !hasVisibleItems);
        });

      if (emptyState) {
        emptyState.classList.toggle("hidden", visibleCount !== 0);
      }
    };

    let selected = readSelected();
    const initialSelections = getInitialSelections();
    const hasInitialSelections = kinds.some(
      (kind) => initialSelections[kind].length > 0,
    );
    const isScopedArchivePage =
      hasInitialSelections && window.location.pathname !== clearUrl;

    syncControls(selected);
    syncPanel(selected);
    applyFilters(selected);
    if (!isScopedArchivePage) {
      updateUrl(selected, clearUrl);
    }

    filterPanel?.addEventListener("toggle", () => {
      filterPanel.dataset.userToggled = "true";
      syncPanel(readSelected());
    });

    const applySelected = (nextSelected) => {
      updateUrl(nextSelected, clearUrl);
      syncControls(nextSelected);
      syncPanel(nextSelected);
      applyFilters(nextSelected);
    };

    clearButton?.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      applySelected(kinds.reduce((acc, kind) => { acc[kind] = new Set(); return acc; }, {}));
    });

    controls.forEach((control) => {
      control.addEventListener("click", (event) => {
        event.preventDefault();

        const kind = control.dataset.filterKind;
        const value = control.dataset.filterValue;
        const nextSelected = readSelected();

        if (nextSelected[kind].has(value)) {
          nextSelected[kind].delete(value);
        } else {
          nextSelected[kind].add(value);
        }

        applySelected(nextSelected);
      });
    });

    const tagSearchBox = root.querySelector("[data-tag-filter-box]");
    const tagSearchInput = root.querySelector("[data-tag-filter-search]");
    const tagOptions = Array.from(root.querySelectorAll("[data-tag-filter-option]"));
    const tagEmptyMessage = root.querySelector("[data-tag-filter-empty]");

    if (tagSearchInput && tagOptions.length > 0) {
      const applyTagSearch = () => {
        const query = tagSearchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        tagOptions.forEach((option) => {
          const label = option.dataset.tagFilterLabel || "";
          const matches = query === "" || label.includes(query);
          option.classList.toggle("hidden", !matches);
          if (matches) visibleCount += 1;
        });

        tagEmptyMessage?.classList.toggle("hidden", visibleCount !== 0);
      };

      tagSearchInput.addEventListener("input", applyTagSearch);

      tagSearchBox?.addEventListener("toggle", () => {
        if (tagSearchBox.open) {
          window.setTimeout(() => tagSearchInput.focus(), 0);
        }
      });
    }
  });

  // Search modal scrollbar compensation
  // ----------------------------------------
  const searchModal = document.querySelector(".search-modal");
  if (searchModal) {
    const clearSearchModalPadding = () => {
      if (searchModal.classList.contains("show")) {
        document.body.style.paddingRight = "";
      }
    };

    const searchModalObserver = new MutationObserver(clearSearchModalPadding);
    searchModalObserver.observe(searchModal, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const bodyStyleObserver = new MutationObserver(clearSearchModalPadding);
    bodyStyleObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["style"],
    });

    clearSearchModalPadding();
  }
})();
