/**
 * Main JS file for Casper behaviours
 */

/* globals jQuery, document */
(function ($, sr, undefined) {
    "use strict";

    var $document = $(document),

        // debouncing function from John Hann
        // unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
        debounce = function (func, threshold, execAsap) {
            var timeout;
            return function debounced () {
                var obj = this, args = arguments;
                function delayed () {
                    if (!execAsap) {
                        func.apply(obj, args);
                    }
                    timeout = null;
                }
                if (timeout) {
                    clearTimeout(timeout);
                } else if (execAsap) {
                    func.apply(obj, args);
                }
                timeout = setTimeout(delayed, threshold || 100);
            };
        };

    $document.ready(function () {
        var $postContent = $(".post-content");
        $postContent.fitVids();

        function updateImageWidth() {
            var $this = $(this),
                contentWidth = $postContent.outerWidth(), // Width of the content
                imageWidth = this.naturalWidth; // Original image resolution

            if (imageWidth >= contentWidth) {
                $this.addClass('full-img');
            } else {
                $this.removeClass('full-img');
            }
        }
        var $img = $("img").on('load', updateImageWidth);
        function casperFullImg() {
            $img.each(updateImageWidth);
        }
        casperFullImg();
        $(window).smartresize(casperFullImg);
        $(".scroll-down").arctic_scroll();
    });

    // smartresize
    jQuery.fn[sr] = function(fn) { return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

    // Arctic Scroll by Paul Adam Davis
    // github.com/PaulAdamDavis/Arctic-Scroll
    $.fn.arctic_scroll = function (options) {

        var defaults = {
            elem: $(this),
            speed: 500
        },

        allOptions = $.extend(defaults, options);

        allOptions.elem.click(function (event) {
            event.preventDefault();
            var $this = $(this),
                $htmlBody = $('html, body'),
                offset = ($this.attr('data-offset')) ? $this.attr('data-offset') : false,
                position = ($this.attr('data-position')) ? $this.attr('data-position') : false,
                toMove;

            if (offset) {
                toMove = parseInt(offset);
                $htmlBody.stop(true, false).animate({scrollTop: ($(this.hash).offset().top + toMove) }, allOptions.speed);
            } else if (position) {
                toMove = parseInt(position);
                $htmlBody.stop(true, false).animate({scrollTop: toMove }, allOptions.speed);
            } else {
                $htmlBody.stop(true, false).animate({scrollTop: ($(this.hash).offset().top) }, allOptions.speed);
            }
        });

    };
})(jQuery, 'smartresize');

// Latest Article
$(function() {
  var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'NOV', 'DEC'];
  function renderSite(data) {
    data = $.xml2json(data);
    var posts = data.channel.item;
    renderLatestArticles(posts);
  }
  function renderLatestArticles(posts) {
    console.log(posts);
    var $parent = $('.sidebox.latest-articles .sidebox-content');
    if(!$parent) {return};
    for(var i = 0; i < 5; i++) {
      var p = posts[i];
      var date = new Date(p.pubDate);
      var dateStr = date.getDate() + ' ' + months[date.getMonth()] + ' ' + date.getFullYear();
      //var $a = $('<a href="' + p.link + '"><div class="date">' + dateStr + '</div><div>' + p.title + '</div></a>');
      var $a = $('<a href="' + p.link + '"><div>' + p.title + '</div></a>');
      if(i == 4) { $a.addClass('last'); }
      $parent.append($a);
    }
  }
  $.ajax({dataType: 'xml', url: '/rss/', type: 'GET'}).success(renderSite);
});


/*!
 * @package jquery.ghostrelated
 * @version 0.2.0
 * @Copyright (C) 2014 Dane Grant (danecando@gmail.com)
 * @License MIT
 */
;(function($) {
    defaults = {
        feed: '/rss/',
        titleClass: '.post-title',
        tagsClass: '.post-meta',
        limit: 5,
        debug: false
    }
    function RelatedPosts(element, options) {
        this.element = element;
        this.options = $.extend({}, defaults, options);
        this.parseRss();
    };
    RelatedPosts.prototype.displayRelated = function(posts) {
        var self = this, count = 0;
        this._currentPostTags = this.getCurrentPostTags(this.options.tagsClass);
        var related = this.matchByTag(this._currentPostTags, posts);
        related.forEach(function(post) {
            if (count < self.options.limit) {
                $(self.element).append($('<li><a href="' + post.url + '">' + post.title + '</a></li>'));
            }
            count++;
        });
        if (count == 0) {
            $(this.element).append($('<p>No related posts were found. Check the <a href="/">index</a>.</p>'));
        }
    };
    RelatedPosts.prototype.parseRss = function(pageNum, prevId, feeds) {
        var page = pageNum || 1,
            prevId = prevId || '',
            feeds = feeds || [],
            self = this;

        $.ajax({
            url: this.options.feed + '/' + page,
            type: 'GET'
        })
        .done(function(data, textStatus, xhr) {
            var curId = $(data).find('item > guid').text();
            if (curId != prevId) {
                feeds.push(data);
                self.parseRss(page+1, curId, feeds);
            } else {
                var posts = self.getPosts(feeds);
                self.displayRelated(posts);
            }
        })
        .fail(function(e) {
            self.reportError(e);
        });
    };

    RelatedPosts.prototype.getCurrentPostTitle = function(titleClass) {
        if (titleClass[0] != '.') {
            titleClass = '.' + titleClass;
        }
        var postTitle = $(titleClass).text();
        if (postTitle.length < 1) {
            this.reportError("Couldn't find the post title with class: " + titleClass);
        }
        return postTitle;
    };
    RelatedPosts.prototype.getCurrentPostTags = function(tagsClass) {
        if (tagsClass[0] != '.') { tagsClass = '.' + tagsClass; }
        var tags = [];
        $(tagsClass + ' a').each(function() { tags.push($(this).text()); });
        if (tags.length < 1) { this.reportError("Couldn't find any tags in this post"); }
        return tags;
    };
    RelatedPosts.prototype.getPosts = function(feeds) {
        var posts = [], items = [];
        feeds.forEach(function(feed) {
            items = $.merge(items, $(feed).find('item'));
        });
        for (var i = 0; i < items.length; i++) {
            var item = $(items[i]);
            if (item.find('title').text() !== this.getCurrentPostTitle(this.options.titleClass)) {
                posts.push({
                    title: item.find('title').text(),
                    url: item.find('link').text(),
                    content: item.find('description').text(),
                    tags: $.map(item.find('category'), function(elem) {
                        return $(elem).text();
                    })
                });
            }
        }
        if (posts.length < 1) {
            this.reportError("Couldn't find any posts in feed: " + feed);
        }
        return posts;
    };
    RelatedPosts.prototype.matchByTag = function(postTags, posts) {

        var matches = [];

        posts.forEach(function(post) {

            var beenAdded = false;
            post.tags.forEach(function(tag) {

                postTags.forEach(function(postTag) {

                    if (postTag.toLowerCase() === tag.toLowerCase() && !beenAdded) {
                        matches.push(post);
                        beenAdded = true;
                    }
                });
            });
        });

        if (matches.length < 1) {
            this.reportError("There are no closely related posts");
        }

        return matches;
    };


    RelatedPosts.prototype.reportError = function(error) {
        if (this.options.debug) {
            $(this.element).append($('<li>' + error + '</li>'));
        }
    };


    $.fn.ghostRelated = function(options) {

        return this.each(function() {
            new RelatedPosts(this, options);
        });
    };

})(jQuery);

