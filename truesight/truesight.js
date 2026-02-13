/* ==========================================================================
   Truesight - Custom Tooltip System
   Author: Necromancer Coding
   ========================================================================== */

$(function () {

    "use strict";

    const Truesight = {

        config: {
            selector: "[title], [data-tooltip-head], [data-tooltip-image], [data-tooltip-icon]",
            followsCursor: true,
            delay: 0,
            fadeSpeed: 250,
            offset: 16
        },

        tooltip: null,
        delayTimer: null,

        init(options = {}) {
            this.config = { ...this.config, ...options };
            this.createTooltip();
            this.bindEvents();
        },

        createTooltip() {
            if ($("#truesight").length) {
                this.tooltip = $("#truesight");
                return;
            }

            this.tooltip = $("<div>", { id: "truesight" })
                .css({
                    position: "absolute",
                    display: "none",
                    zIndex: 9999
                })
                .appendTo("body");
        },

        bindEvents() {
            const self = this;

            $(document)

                .on("mouseenter.truesight", self.config.selector, function (e) {
                    self.show($(this), e);
                })

                .on("mousemove.truesight", self.config.selector, function (e) {
                    if (self.config.followsCursor) {
                        self.position(e);
                    }
                })

                .on("mouseleave.truesight click.truesight", self.config.selector, function () {
                    self.hide($(this));
                });
        },

        buildContent($el) {
            const title = $el.data("ts-title") || $el.attr("title");
            const head = $el.data("tooltip-head");
            const image = $el.data("tooltip-image");
            const icon = $el.data("tooltip-icon");

            const container = $("<div>");

            if (image) {
                $("<div>", { class: "ts-image" })
                    .append($("<img>", { src: image, alt: "" }))
                    .appendTo(container);
            }

            if (icon) {
                $("<div>", { class: "ts-image" })
                    .append($("<em>", { class: icon }))
                    .appendTo(container);
            }

            if (head) {
                $("<div>", { class: "ts-head", text: head }).appendTo(container);
            }

            if (title) {
                $("<div>", { class: "ts-text", text: title }).appendTo(container);
            }

            return container;
        },

        show($el, event) {

			const title = $el.attr("title");
			const head = $el.data("tooltip-head");
			const image = $el.data("tooltip-image");
			const icon = $el.data("tooltip-icon");

			// Stop only if absolutely nothing exists
			if (!title && !head && !image && !icon) return;

			if (title) {
				$el.data("ts-title", title).attr("title", "");
			}

			const content = this.buildContent($el);

			this.tooltip
				.empty()
				.append(content)
				.css({ opacity: 0, display: "block" });

			const self = this;

			this.delayTimer = setTimeout(function () {
				self.tooltip.stop(true).fadeTo(self.config.fadeSpeed, 1);
			}, this.config.delay);

			this.position(event);
		},

        hide($el) {

            clearTimeout(this.delayTimer);

            const originalTitle = $el.data("ts-title");
            if (originalTitle) {
                $el.attr("title", originalTitle);
            }

            this.tooltip.stop(true).fadeOut(this.config.fadeSpeed);
        },

        position(event) {

            const tooltipWidth = this.tooltip.outerWidth();
            const tooltipHeight = this.tooltip.outerHeight();

            const windowRight = $(window).scrollLeft() + $(window).width();
            const windowBottom = $(window).scrollTop() + $(window).height();

            let left = event.pageX + this.config.offset;
            let top = event.pageY + this.config.offset;

            if (left + tooltipWidth > windowRight) {
                left = event.pageX - tooltipWidth - this.config.offset;
            }

            if (top + tooltipHeight > windowBottom) {
                top = event.pageY - tooltipHeight - this.config.offset;
            }

            this.tooltip.css({ left, top });
        }
    };

    /* ==========================================================================
       Initialize Truesight
       ========================================================================== */

    Truesight.init({
        followsCursor: true,
        delay: 0,
        fadeSpeed: 300
    });

});
