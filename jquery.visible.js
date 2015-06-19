(function($){

    /**
     * Copyright 2012, Digital Fusion
     * Copyright 2015, picoded.com
     *
     * Licensed under the MIT license.
     * http://teamdf.com/jquery-plugins/license/
     *
     * @author (original) Sam Sehnert
     * @author (refactored by) Eugene Cheah (eugene@picoded.com)
     *
     * @desc A small plugin that checks whether elements are within
     *       the user visible viewport of a web browser.
     *       only accounts for vertical position, not horizontal.
     */

    /// Gets the boundingClientRect() box value natively, or via jQuery of the first matched element. Returns false if no nodes in the list
    $.fn.getBoundingClientRect = function() {
        if (this.length < 1)
            return false;

        var $t = this.length > 1 ? this.eq(0) : this;
        var _t = $t.get(0);

        if (typeof _t.getBoundingClientRect === 'function') {
            return _t.getBoundingClientRect();
        } else {
            var offset = $t.offset(),
                width = $t.width(),
                height = $t.height();

            return {
                top: offset.top,
                left: offset.left,
                bottom: offset.top+height,
                right: offset.left+width,

                width: width,
                height: height
            };
        }
    }

    /// Does a visibility check within the parent object, and given offset.
    $.fn.visibleFromParentAndOffset = function(parent,offset,partial,hidden,direction){
        if (this.length < 1)
            return;

        var $t        = this.length > 1 ? this.eq(0) : this,
            _t        = $t.get(0);

        /// Does visibility check is needed?
        if( !(hidden === true ? (_t.offsetWidth * _t.offsetHeight) > 0 : true) ) {
            return false;
        }

        offset = (offset)? offset : {};
        direction = (direction) ? direction : 'both';

        var $p        = parent.length > 1 ? parent.eq(0) : parent,

            tBounding = $t.getBoundingClientRect(),
            pBounding = $p.getBoundingClientRect();

        if( !pBounding ) {
            return false;
        }

        var tFullOffsets = {
            top : parseInt(tBounding.top),
            left : parseInt(tBounding.left),

            bottom: parseInt(tBounding.top) + parseInt(tBounding.height),
            right : parseInt(tBounding.left) + parseInt(tBounding.width)
        },
            oFullOffsets = {
                top: parseInt(pBounding.top) + parseInt( (!isNaN(offset.top))? offset.top : 0 ),
                left: parseInt(pBounding.left) + parseInt( (!isNaN(offset.left))? offset.left : 0 ),

                bottom: parseInt(pBounding.top) + parseInt( (!isNaN(offset.bottom))? offset.bottom : 0 ) + parseInt(pBounding.height),
                right: parseInt(pBounding.left) + parseInt( (!isNaN(offset.right))? offset.right : 0 ) + parseInt(pBounding.width)
            },

            tViz = tFullOffsets.top >= oFullOffsets.top && tFullOffsets.top < oFullOffsets.bottom,
            bViz = tFullOffsets.bottom >= oFullOffsets.top && tFullOffsets.bottom < oFullOffsets.bottom,
            vVisible_large = tFullOffsets.top <= oFullOffsets.top && tFullOffsets.bottom >= oFullOffsets.bottom, //partial matching for dom, larger then the window
            vVisible = partial? tViz || bViz || vVisible_large : tViz && bViz;

        if(direction === 'vertical') { //only checks vertical
            return vVisible;
        } 

        var lViz = tFullOffsets.left >= oFullOffsets.left && tFullOffsets.left < oFullOffsets.right,
            rViz = tFullOffsets.right >= oFullOffsets.right && tFullOffsets.right < oFullOffsets.right,
            hVisible_large = tFullOffsets.left <= oFullOffsets.left && tFullOffsets.right >= oFullOffsets.right, //partial matching for dom, larger then the window
            hVisible = partial? lViz || rViz || hVisible_large : lViz && rViz;

        if(direction === 'horizontal') { //only check horizontal
            return hVisible;
        } 

        // Assumes check both
        return vVisible && hVisible;
    };

    /// Original syntax support
    $.fn.visible = function(partial,hidden,direction){
        return this.visibleFromParentAndOffset($("body"), null, partial,hidden,direction);
    };

})(jQuery);