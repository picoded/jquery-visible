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
      *       the user visible viewport of a web browser. Adds the following functions
      *
      *       + getFullOffsets : gets the full top,left,bottom,right offsets relative to 
      *                          the top,left corner of the browser. With an optional delta 
      *                          adjustment of results. Also returns object width / height.
      *
      *       + visibleFromParentAndOffset : Extends the original visible function, to check 
      *                                      relative to a parent view box, and its offsets
      *
      *       + visible : original visible functionality by Sam Sehnert
      */

    /// gets the full top,left,bottom,right offsets relative to the top,left corner of the browser. 
    $.fn.getFullOffsets = function( delta ) {
        if (this.length < 1)
            return false;
        
        delta = (delta)? delta : {};

        var $t = this.length > 1 ? this.eq(0) : this,
            _t = $t.get(0),
            offset, width, height;

        if (typeof _t.getBoundingClientRect === 'function') {
            offset = _t.getBoundingClientRect();
            width = offset.width;
            height = offset.height;
        } else {
            offset = offset = $t.offset();
            width = $t.width();
            height = $t.height();
        }

        return {
            top:    offset.top  +          (isNaN(delta.top)?    0 : parseFloat(delta.top)    ),
            left:   offset.left +          (isNaN(delta.left)?   0 : parseFloat(delta.left)   ),
            bottom: offset.top  + height + (isNaN(delta.bottom)? 0 : parseFloat(delta.bottom) ),
            right:  offset.left + width  + (isNaN(delta.right)?  0 : parseFloat(delta.right)  ),
            
            width:  width  +               (isNaN(delta.width)?  0 : parseFloat(delta.width)  ),
            height: height +               (isNaN(delta.height)? 0 : parseFloat(delta.height) )
        };
    }

    /// Does a visibility check within the parent object, and given offset.
    $.fn.visibleFromParentAndOffset = function(parent,offset,partial,hidden,direction){
        if (this.length < 1)
            return;

        var $t = this.length > 1 ? this.eq(0) : this,
            _t = $t.get(0);

        /// Does visibility check is needed?
        if( !(hidden === true ? (_t.offsetWidth * _t.offsetHeight) > 0 : true) ) {
            return false;
        }

        offset    = (offset)?     offset    : {};
        direction = (direction) ? direction : 'both';

        var $p           = parent.length > 1 ? parent.eq(0) : parent,
            tFullOffsets = $t.getFullOffsets(),
            pFullOffsets = $p.getFullOffsets( offset );

        if( !tFullOffsets || !pFullOffsets ) {
            return false;
        }

        var tViz = tFullOffsets.top    >= pFullOffsets.top && tFullOffsets.top    < pFullOffsets.bottom,
            bViz = tFullOffsets.bottom >= pFullOffsets.top && tFullOffsets.bottom < pFullOffsets.bottom,
            //
            // partial matching for dom, larger then the parent dom
            //
            vVisible_large = tFullOffsets.top <= pFullOffsets.top && tFullOffsets.bottom >= pFullOffsets.bottom,
            vVisible       = partial? tViz || bViz || vVisible_large : tViz && bViz;

        if(direction === 'vertical') { //only checks vertical
            return vVisible;
        }

        var lViz = tFullOffsets.left >= pFullOffsets.left && tFullOffsets.left < pFullOffsets.right,
            rViz = tFullOffsets.right >= pFullOffsets.right && tFullOffsets.right < pFullOffsets.right,
            //
            // partial matching for dom, larger then the parent dom
            //
            hVisible_large = tFullOffsets.left <= pFullOffsets.left && tFullOffsets.right >= pFullOffsets.right, 
            hVisible       = partial? lViz || rViz || hVisible_large : lViz && rViz;

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
