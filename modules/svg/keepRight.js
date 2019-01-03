import _throttle from 'lodash-es/throttle';
import { select as d3_select } from 'd3-selection';

import { modeBrowse } from '../modes';
import { svgPointTransform } from './index';
import { services } from '../services';


export function svgKeepRight(projection, context, dispatch) {
    var throttledRedraw = _throttle(function () { dispatch.call('change'); }, 1000);
    var minZoom = 12;
    var layer = d3_select(null);
    var _keepRight;

    function markerPath(selection, klass) {
        selection
            .attr('class', klass)
            .attr('transform', 'translate(-4, -24)')
            .attr('d', 'M11.6,6.2H7.1l1.4-5.1C8.6,0.6,8.1,0,7.5,0H2.2C1.7,0,1.3,0.3,1.3,0.8L0,10.2c-0.1,0.6,0.4,1.1,0.9,1.1h4.6l-1.8,7.6C3.6,19.4,4.1,20,4.7,20c0.3,0,0.6-0.2,0.8-0.5l6.9-11.9C12.7,7,12.3,6.2,11.6,6.2z');
    }


    function init() {
        if (svgKeepRight.initialized) return;  // run once
        svgKeepRight.enabled = false;
        svgKeepRight.initialized = true;
    }


    function getService() {
        if (services.keepRight && !_keepRight) {
            _keepRight = services.keepRight;
            _keepRight.event.on('loaded', throttledRedraw);
        } else if (!services.keepRight && _keepRight) {
            _keepRight = null;
        }
        return _keepRight;
    }


    function showLayer() {
        var service = getService();
        if (!service) return;
        editOn();

        layer
            .classed('disabled', false)
            .style('opacity', 0)
            .transition()
            .duration(250)
            .style('opacity', 1)
            .on('end interrupt', function () {
                dispatch.call('change');
            });
    }


    function hideLayer() {
        throttledRedraw.cancel();
        editOff();

        layer
            .transition()
            .duration(250)
            .style('opacity', 0)
            .on('end interrupt', function () {
                layer.classed('disabled', true);
                dispatch.call('change');
            });
    }


    function editOn() {
        layer.style('display', 'block');
    }


    function editOff() {
        layer.selectAll('.kr_error').remove();
        layer.style('display', 'none');
    }


    function update() {
        var service = getService();
        var selectedID = context.selectedErrorID();
        var data = (service ? service.getErrors(projection) : []);
        var transform = svgPointTransform(projection);
        var kr_errors = layer.selectAll('.kr_error')
            .data(data, function(d) { return d.id; });

        // exit
        kr_errors.exit()
            .remove();

        // enter
        var kr_errorsEnter = kr_errors.enter()
            .append('g')
            .attr('class', function(d) {
                return 'kr_error kr_error-' + d.id + ' kr_error_type_' + d.parent_error_type; }
            );

        kr_errorsEnter
            .append('ellipse')
            .attr('cx', 0.5)
            .attr('cy', 1)
            .attr('rx', 6.5)
            .attr('ry', 3)
            .attr('class', 'stroke');

        kr_errorsEnter
            .append('path')
            .call(markerPath, 'shadow');

        kr_errorsEnter
            .append('use')
            .attr('class', 'kr_error-fill')
            .attr('width', '20px')
            .attr('height', '20px')
            .attr('x', '-8px')
            .attr('y', '-22px')
            .attr('xlink:href', '#iD-icon-bolt');

        // update
        kr_errors
            .merge(kr_errorsEnter)
            .sort(function(a, b) {
                return (a.id === selectedID) ? 1
                    : (b.id === selectedID) ? -1
                    : b.loc[1] - a.loc[1];  // sort Y
            })
            .classed('selected', function(d) { return d.id === selectedID; })
            .attr('transform', transform);
    }


    function drawKeepRight(selection) {
        var enabled = svgKeepRight.enabled;
        var service = getService();

        layer = selection.selectAll('.layer-keepRight')
            .data(service ? [0] : []);

        layer.exit()
            .remove();

        layer = layer.enter()
            .append('g')
            .attr('class', 'layer-keepRight')
            .style('display', enabled ? 'block' : 'none')
            .merge(layer);

        if (enabled) {
            if (service && ~~context.map().zoom() >= minZoom) {
                editOn();
                update();
                service.loadErrors(context, projection);
            } else {
                editOff();
            }
        }
    }


    drawKeepRight.enabled = function(_) {
        if (!arguments.length) return svgKeepRight.enabled;
        svgKeepRight.enabled = _;
        if (svgKeepRight.enabled) {
            showLayer();
        } else {
            hideLayer();
            if (context.selectedErrorID()) {
                context.enter(modeBrowse(context));
            }
        }
        dispatch.call('change');
        return this;
    };


    drawKeepRight.supported = function() {
        return !!getService();
    };


    init();
    return drawKeepRight;
}
