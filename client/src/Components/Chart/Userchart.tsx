import React, { useState, useEffect, useCallback } from 'react';
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
for (let i=1; i<=31; i++) {
    userData.push({
        date: i < 10 ? `03-0${i}-2021` : `03-${i}-2021`,
        weight: Math.floor(195 + Math.random() * 10 + (i + 31) * 0.3),
        calories: Math.floor(2000 + Math.random() * 200 + (i + 31) * 15)
    })
};
for (let i=1; i<=30; i++) {
    userData.push({
        date: i < 10 ? `04-0${i}-2021` : `04-${i}-2021`,
        weight: Math.floor(195 + Math.random() * 10 + (i + 31) * 0.3),
        calories: Math.floor(2000 + Math.random() * 200 + (i + 31) * 15)
    })
};
for (let i=1; i<=31; i++) {
    userData.push({
        date: i < 10 ? `05-0${i}-2021` : `05-${i}-2021`,
        weight: Math.floor(195 + Math.random() * 10 + (i + 31) * 0.3),
        calories: Math.floor(2000 + Math.random() * 200 + (i + 31) * 15)
    })
};
for (let i=1; i<=30; i++) {
    userData.push({
        date: i < 10 ? `06-0${i}-2021` : `06-${i}-2021`,
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

export interface Props {
    showCalories: boolean,
    showWeight: boolean,
    timeScale: string,
}

export default function Userchart (props: Props) {
    // make graph size responsize to client browser size - maintaining 1920p aspect ratio
    // follow Bootstraps CSS breakpoints for a clean look:
    // x-small:  < 576px -- content width: 100%
    // small:   >= 576px -- content width: 540px
    // medium:  >= 768px -- content width: 720px
    // large:   >= 992px -- content width: 960px
    // xlarge:  >= 1200px -- content width: 1140px
    // xxlarge: >= 1400px -- content width: 1320px
    // chart is 75% of content width

    const windowWidth = window.innerWidth;
    const chartWidthPercentage = 0.75;
    let contentWidth = 1320 * chartWidthPercentage;
    if (windowWidth >= 1400) {
        contentWidth = 1320 * chartWidthPercentage;
    } else if (windowWidth >= 1200) {
        contentWidth = 1140 * chartWidthPercentage;
    } else if (windowWidth >= 992) {
        contentWidth = 960 * chartWidthPercentage;
    } else if (windowWidth >= 768) {
        contentWidth = 720;
    } else if (windowWidth >= 576) {
        contentWidth = 540;
    } else {
        contentWidth = windowWidth;
    };

    const [graphDims, setGraphDims] = useState({
        width: contentWidth,
        height: 1080 * contentWidth / 1920,
    });

    useEffect(() => {
        const handleResize = () => {
            let newWidth = graphDims.width;
            if (windowWidth >= 1400) {
                newWidth = 1320 * chartWidthPercentage;
            } else if (windowWidth >= 1200) {
                newWidth = 1140 * chartWidthPercentage;
            } else if (windowWidth >= 992) {
                newWidth = 960 * chartWidthPercentage;
            } else if (windowWidth >= 768) {
                newWidth = 720;
            } else if (windowWidth >= 576) {
                newWidth = 540;
            } else {
                newWidth = windowWidth;
            };

            if (newWidth !== graphDims.width) {
                setGraphDims({
                    width: newWidth,
                    height: 1080 * newWidth / 1920,
                });
            };
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize)
        };
    }, [windowWidth])

    
    // DATA SCALING
    // =============================================================================
    
    // determing starting date from data:
    let startingDate = userData[0].date;
    if (props.timeScale === '7d') {
        startingDate = userData[userData.length - 7] ? userData[userData.length - 7].date : userData[0].date;
    } else if (props.timeScale === '1m') {
        startingDate = userData[userData.length - 31] ? userData[userData.length - 31].date : userData[0].date;
    } else if (props.timeScale === '1y') {
        startingDate = userData[userData.length - 365] ? userData[userData.length - 365].date : userData[0].date;
    }

    const xScale = scaleTime({
        domain: [
            new Date(startingDate),
            new Date(userData[userData.length - 1].date)
        ],
        range: [0, graphDims.width],
    });

    const yScaleLeft = scaleLinear({
        domain: [
            Math.min(...userData.map(data => data.calories)) - 500,
            Math.max(...userData.map(data => data.calories)) + 500
        ],
        range: [graphDims.height, 0],
        round: true,
        nice: true
    });

    const yScaleRight = scaleLinear({
        domain: [
            Math.min(...userData.map(data => data.weight)) - 20,
            Math.max(...userData.map(data => data.weight)) + 20
        ],
        range: [graphDims.height, 0],
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
            <svg className="chart" width={graphDims.width} height={graphDims.height} ref={containerRef} >
                <rect
                    x={0}
                    y={0}
                    width={graphDims.width}
                    height={graphDims.height}
                    fill={'#e8e8e8'}
                    rx={14}
                    onTouchStart={handleTooltip}
                    onTouchMove={handleTooltip}
                    onMouseMove={handleTooltip}
                    onMouseOver={handleTooltip}
                    onMouseLeave={() => hideTooltip()}
                />
                <Group>
                    <GridRows scale={yScaleLeft} width={graphDims.width} />
                    <GridColumns scale={xScale} height={graphDims.height} />
                    {/* <AxisBottom top={height-100} scale={xScale} numTicks={5} /> */}
                    {/* <AxisLeft scale={yScaleLeft} /> */}
                    {/* <text x="-75" y="30" transform="rotate(-90)" fontSize={18}>
                        Calories
                    </text> */}

                    {/* ================ DATA ================ */}
                    {props.showCalories && userData.map((data, index) => {
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
                    {props.showCalories && <LinePath
                        data={userData}
                        x={data => xScale(new Date(data.date))}
                        y={data => yScaleLeft(data.calories)}
                        curve={curveMonotoneX}
                        stroke="blue"
                        strokeWidth={1.5}
                    />}
                    {props.showWeight && userData.map((data, index) => {
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
                    {props.showWeight && <LinePath
                        data={userData}
                        x={data => xScale(new Date(data.date))}
                        y={data => yScaleRight(data.weight)}
                        curve={curveMonotoneX}
                        stroke="red"
                        strokeWidth={1.5}
                    />}
                    {/* ================ DATA ================ */}
                </Group>

                {tooltipData && tooltipOpen && (
                    <>
                    {/* =========== DATA HIGHLIGHT ON HOVER =========== */}
                        <Line 
                            from={{ x: tooltipLeft, y: graphDims.height }}
                            to={{ x: tooltipLeft, y: 0 }}
                            stroke={'#aaa'}
                            strokeWidth={2}
                            pointerEvents="none"
                        />
                        {/* calorie data marker */}
                        {props.showCalories && <circle
                            cx={tooltipLeft}
                            cy={yScaleLeft(getCalories(tooltipData))}
                            r={4}
                            fill={'blue'}
                            stroke={'white'}
                            strokeWidth={2}
                            pointerEvents="none"
                        />}
                        {/* weight data marker */}
                        {props.showWeight && <circle
                            cx={tooltipLeft}
                            cy={yScaleRight(getWeight(tooltipData))}
                            r={4}
                            fill={'red'}
                            stroke={'white'}
                            strokeWidth={2}
                            pointerEvents="none"
                        />}
                    {/* =========  END DATA HIGHLIGHT ON HOVER ========= */}
                    </>
                )}
            </svg>

            {tooltipData && tooltipOpen && (
                <>
                    <TooltipInPortal
                        key={Math.random()}
                        top={0}
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
                        top={graphDims.height - 25}
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