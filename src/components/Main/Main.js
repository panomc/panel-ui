'use strict';

Vue.directive('tooltip', function (el, binding) {
    if (binding.value !== $(el).attr('data-original-title')) {
        $(el)
            .attr('data-original-title', binding.value)
            .tooltip({
                title: binding.value,
                placement: binding.arg,
                trigger: "hover",
                selector: true
            });

        if ($($(el).data("bs.tooltip").tip).hasClass("show")) {
            $(el).tooltip('show')
        }
    }
});

Vue.component('Main', new Promise(function (resolve) {
        requirejs([
            "/panel/assets/js/chart.min.js"
        ], function () {
            resolve({
                components: {
                    Navbar: function (resolve, reject) {
                        loadComponent('Navbar', '/panel/src/components/Main/Navbar').then(resolve, reject);
                    },
                    Sidebar: function (resolve, reject) {
                        loadComponent('Sidebar', '/panel/src/components/Main/Sidebar').then(resolve, reject);
                    }
                },
                computed: {
                    routePageLoading() {
                        return this.$store.state.routePageLoading
                    },

                    initialPageDataLoading() {
                        return this.$store.state.initialPageDataLoading
                    }
                },
                template: PANO.UI,
                mounted() {
                    $('[data-toggle="tooltip"]').tooltip()
                }
            });
        });
    })
);