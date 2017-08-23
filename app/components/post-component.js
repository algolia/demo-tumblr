import _ from 'lodash';
import Masonry from 'masonry-layout';
postDirective.$inject = ['$timeout'];
export function postDirective($timeout) {
    return {
        restrict: 'E'
        , controller: 'PostController'
        , controllerAs: 'postController'
        , bindToController: true
        , templateUrl: './app/components/post-component.html'
        , link: link
    };

    function link(scope, $element, attributes, controller) {
        scope.$watch('postController.postsResults', function () {
            $timeout(function () {
                var elem = document.querySelector('.grid');
                var msnry = new Masonry(elem, {
                    itemSelector: '.grid-item'
                    , gutter: 20
                    , stamp: '.stamp'
                });
            }, 0, false);
        });
        
        window.addEventListener("scroll", _.throttle(loadMore, 120));
        
        function loadMore() {
            if ((window.scrollY + window.innerHeight) > (document.documentElement.scrollHeight - (window.innerHeight * .6))) {
                controller._searchStore.updatePagination();
            }
        }
    }
}

class PostController {
    static get $inject() {
        return ['searchStore', '$sce'];
    }
    constructor(searchStore, $sce) {
        this._searchStore = searchStore;
        this._$sce = $sce;
    }
    get colWidth() {
        return ((window.innerWidth - 100) / 4);
    }
    get postsResults() {
        return this._searchStore.postsResults;
    }
    renderHtml(text) {
        return this._$sce.trustAsHtml(text);
    }
    convertToDate(timestamp) {
        return new Date(timestamp * 1000);
    }
}
export default PostController;