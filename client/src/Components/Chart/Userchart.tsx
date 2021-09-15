import React, { useCallback } from 'react';
import { Group } from '@visx/group';
import { scaleLinear, scaleUtc, scaleTime} from '@visx/scale';
import { GridRows, GridColumns } from '@visx/grid';
import { AxisBottom, AxisLeft, AxisRight } from '@visx/axis';
import { LinePath, Line } from '@visx/shape';
import { curveMonotoneX } from '@visx/curve';
import { withTooltip, useTooltip, useTooltipInPortal, TooltipWithBounds, Tooltip, defaultStyles } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { localPoint } from '@visx/event';
// import { Text } from '@visx/text';
import { bisector } from 'd3-array';
import { timeFormat } from 'd3-time-format';

import './Userchart.css';
import Chartdatatooltip from '../Chartdatatooltip/Chartdatatooltip.js';

// ==================================================================================

// TEMP FAKE DATA
const userData: { 'date': string, 'weight': number, 'calories': number }[] = []
for (let i=1; i<=31; i++) {
    userData.push({
        date: i < 10 ? `01-0${i}-2021` : `01-${i}-2021`,
        weight: Math.floor(195 + Math.random() * 10 + i * 0.3),
        calories: Math.floor(2000 + Math.random() * 200 + i * 15)
    })
};
for (let i=1; i<=28; i++) {
    userData.push({
        date: i < 10 ? `02-0${i}-2021` : `02-${i}-2021`,
        weight: Math.floor(195 + Math.random() * 10 + (i + 31) * 0.3),
        calories: Math.floor(2000 + Math.random() * 200 + (i + 31) * 15)
    })
};

// UTILS, ACCESSORS
// =============================================================================

const formatDate = timeFormat("%b %d, '%y");

type TooltipData = typeof userData[0];
const getDate = (d: TooltipData) => new Date(d.date);
const getCalories = (d: TooltipData) => d.calories;
const getWeight = (d: TooltipData) => d.weight;
const bisectDate = bisector<TooltipData, Date>(d => new Date(d.date)).left;

export type AreaProps = {
    width: number,
    height: number
};

export default function Userchart () {
    const width = 1920 / 1.5;
    const height = 1080 / 1.5;

    
    // SCALING
    // =============================================================================

    const xScale = scaleTime({
        domain: [
            new Date(userData[0].date),
            new Date(userData[userData.length - 1].date)
        ],
        range: [0, width],
    });

    const yScaleLeft = scaleLinear({
        domain: [
            Math.min(...userData.map(data => data.calories)) - 500,
            Math.max(...userData.map(data => data.calories)) + 500
        ],
        range: [height, 0],
        round: true,
        nice: true
    });

    const yScaleRight = scaleLinear({
        domain: [
            Math.min(...userData.map(data => data.weight)) - 20,
            Math.max(...userData.map(data => data.weight)) + 20
        ],
        range: [height, 0],
        round: true,
        nice: true
    });

    // TOOLTIPS
    // =============================================================================

    const {
        containerRef,
        TooltipInPortal
    } = useTooltipInPortal({
        scroll: true,
        detectBounds: true,
    });

    const {
        tooltipData,
        tooltipLeft,
        tooltipTop,
        tooltipOpen,
        showTooltip,
        hideTooltip,
    } = useTooltip<TooltipData>({
        // initial states
        tooltipOpen: true,
        tooltipLeft: 100,
        tooltipTop: 100,
        // TODO: add initial message here
    });

    const handleTooltip = useCallback(
        (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
            const { x } = localPoint(event) || { x: 0 };
            const x0 = xScale.invert(x);
            const index = bisectDate(userData, x0, 1);
            const d0 = userData[index - 1];
            const d1 = userData[index];
            let d = d0;
            if (d1 && getDate(d1) && d0 && getDate(d0)) {
                d = x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0;
                showTooltip({
                    tooltipLeft: x,
                    tooltipTop: yScaleLeft(getCalories(d)),
                    tooltipData: d
                });
            };
        }, [showTooltip, xScale, yScaleLeft]
    );

    return (
        <div className="chart-wrapper">
            <svg className="chart" width={width} height={height} ref={containerRef} >
                <rect
                    x={0}
                    y={0}
                    width={width}
                    height={height}
                    fill={'#e8e8e8'}
                    rx={14}
                    onTouchStart={handleTooltip}
                    onTouchMove={handleTooltip}
                    onMouseMove={handleTooltip}
                    onMouseOver={handleTooltip}
                    onMouseLeave={() => hideTooltip()}
                />
                <Group>
                    <GridRows scale={yScaleLeft} width={width} />
                    <GridColumns scale={xScale} height={height} />
                    {/* <AxisBottom top={height-100} scale={xScale} numTicks={5} /> */}
                    {/* <AxisLeft scale={yScaleLeft} /> */}
                    {/* <text x="-75" y="30" transform="rotate(-90)" fontSize={18}>
                        Calories
                    </text> */}

                    {/* ================ DATA ================ */}
                    {userData.map((data, index) => {
                        return (
                            <circle
                                key={index}
                                r={1}
                                cx={xScale(new Date(data.date))}
                                cy={yScaleLeft(data.calories)}
                                stroke="rgba(0,0,255,1)"
                                fill="transparent"
                            />
                        )
                    })}
                    {userData.map((data, index) => {
                        return (
                            <circle
                                key={index}
                                r={1}
                                cx={xScale(new Date(data.date))}
                                cy={yScaleRight(data.weight)}
                                stroke="rgba(255,0,0,1)"
                                fill="transparent"
                            />
                        )
                    })}
                    <LinePath
                        data={userData}
                        x={data => xScale(new Date(data.date))}
                        y={data => yScaleLeft(data.calories)}
                        curve={curveMonotoneX}
                        stroke="blue"
                        strokeWidth={1.5}
                    />
                    <LinePath
                        data={userData}
                        x={data => xScale(new Date(data.date))}
                        y={data => yScaleRight(data.weight)}
                        curve={curveMonotoneX}
                        stroke="red"
                        strokeWidth={1.5}
                    />
                    {/* ============== END DATA ============== */}
                </Group>

                {tooltipData && tooltipOpen && (
                    <>
                        <Line 
                            from={{ x: tooltipLeft, y: height }}
                            to={{ x: tooltipLeft, y: 0 }}
                            stroke={'#aaa'}
                            strokeWidth={2}
                            pointerEvents="none"
                        />
                        {/* calorie data marker */}
                        <circle
                            cx={tooltipLeft}
                            cy={tooltipTop}
                            r={4}
                            fill={'blue'}
                            stroke={'white'}
                            strokeWidth={2}
                            pointerEvents="none"
                        />
                    </>
                )}
            </svg>

            {tooltipData && tooltipOpen && (
                <>
                    <TooltipInPortal
                        key={Math.random()}
                        top={height/8}
                        left={tooltipLeft}
                        className='data-tooltip'
                    >
                        <Chartdatatooltip
                            calories={getCalories(tooltipData)}
                            weight={getWeight(tooltipData)}
                        />
                    </TooltipInPortal>
                    <TooltipInPortal
                        key={Math.random()}
                        top={height - 25}
                        left={tooltipLeft ? tooltipLeft - 52 : tooltipLeft}
                        className='date-tooltip'
                    >
                        {formatDate(getDate(tooltipData))}
                    </TooltipInPortal>
                </>
            )}
        </div>
    )
};