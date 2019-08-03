import React, { Component } from 'react'
import { Text, View, Dimensions, PanResponder, StatusBar } from 'react-native'
import Svg, { Line, Polygon } from 'react-native-svg';
import { accelerometer, setUpdateIntervalForType, SensorTypes } from "react-native-sensors";

StatusBar.setHidden(true)

const width = Dimensions.get('window').width - 50;
const height = Dimensions.get('window').height - 50;
let innerHeight = height/2;
let innerWidth = width/2;
let mt = (height - innerHeight) / 2; 
let ml = (width - innerWidth) / 2; 

export default class Sensor extends Component {
    constructor(props) {
        super(props);
        this.x = 0;
        this.y = 0;
        this.panResponder = PanResponder.create({
            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                this.xRef = gestureState.x0 - (innerWidth);
                this.yRef = gestureState.y0 - (innerHeight);
            },
            onPanResponderMove: (evt, gestureState) => {
                innerWidth = (gestureState.moveX - this.xRef);
                innerHeight = (gestureState.moveY - this.yRef);
                if(innerWidth<0)innerWidth=0;
                if(innerHeight<0)innerHeight=0;
                mt = (height - innerHeight) / 2; 
                ml = (width - innerWidth) / 2; 
                this.setState({})
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
            },
            onShouldBlockNativeResponder: (evt, gestureState) => true,
        });
    }

    componentDidMount(){
        this.subscription = accelerometer.subscribe(({ x, y, z, timestamp }) =>{
            this.x = x * width / 10;
            this.y = -y * width / 10;
            this.setState({})
        });
        setUpdateIntervalForType(SensorTypes.accelerometer, 50);
    }
    componentWillUnmount(){
        this.subscription.unsubscribe();
    }

    SideWallColors = () => {
        return (
            <View style={{ position: 'absolute', opacity: 0.5 }}>
                <Svg height={height} width={width} style={{ position: 'absolute', opacity: 0.3, }}>
                    <Polygon
                        points={`0,0 ${ml + this.x},${mt + this.y} ${ml + innerWidth + this.x},${mt + this.y} ${width},0`}
                        fill="grey"
                    />
                </Svg>
                <Svg height={height} width={width} style={{ position: 'absolute', opacity: 0.9, }}>
                    <Polygon
                        points={`0,0 ${(ml) + this.x},${(mt) + this.y} ${(ml) + this.x},${(mt + innerHeight) + this.y} 0,${height}`}
                        fill="grey"
                    />
                </Svg>
                <Svg height={height} width={width} style={{ position: 'absolute', opacity: 0.9, }}>
                    <Polygon
                        points={`0,${height} ${(ml) + this.x},${(innerHeight + mt) + this.y} ${(ml + innerWidth) + this.x},${(innerHeight + mt) + this.y} ${width},${height}`}
                        fill="grey"
                    />
                </Svg>
                <Svg height={height} width={width} style={{ position: 'absolute', opacity: 0.4, }}>
                    <Polygon
                        points={`${width},${height} ${(innerWidth + ml) + this.x},${(innerHeight + mt) + this.y} ${(innerWidth + ml) + this.x},${(mt) + this.y} ${width},0`}
                        fill="grey"
                    />
                </Svg>
            </View>
        )
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: 'white', paddingLeft: 25, paddingTop: 25 }}>
                <View style={{ height, width: width + 4, borderWidth: 2, backgroundColor: '#f2f2f2', overflow: 'hidden' }}  {...this.panResponder.panHandlers}>
                    <View style={{ height: innerHeight + (mt*3/2), width: innerWidth + (ml*3/2), borderWidth: 1, marginLeft: ml / 4 + (this.x * 3 / 12), marginTop: mt / 4 + (this.y * 3 / 12), position: 'absolute' }} />
                    <View style={{ height: innerHeight + (mt), width: innerWidth + (ml), borderWidth: 1, marginLeft: ml / 2 + (this.x * 6 / 12), marginTop: mt / 2 + (this.y * 6 / 12), position: 'absolute' }} />
                    <View style={{ height: innerHeight + (mt/2), width: innerWidth + (ml/2), borderWidth: 1, marginLeft: ml * 3 / 4 + (this.x * 9 / 12), marginTop: mt * 3 / 4 + (this.y * 9 / 12), position: 'absolute' }} />
                    
                    <View style={{ height: innerHeight, width: innerWidth, borderWidth: 1, marginLeft: ml + this.x, marginTop: mt + this.y, backgroundColor: 'grey', opacity: 0.5}}/>
                    {this.SideWallColors()}
                    <Svg height={height} width={width} style={{ position: 'absolute', }}>
                        <Line
                            x1="0"
                            y1="0"
                            x2={(ml) + this.x}
                            y2={(mt) + this.y}
                            stroke="black"
                            strokeWidth="1"
                        />
                    </Svg>
                    <Svg height={height} width={width} style={{ position: 'absolute', }}>
                        <Line
                            x1={width}
                            y1="0"
                            x2={(ml + innerWidth) + this.x}
                            y2={(mt) + this.y}
                            stroke="black"
                            strokeWidth="1"
                        />
                    </Svg>
                    <Svg height={height} width={width} style={{ position: 'absolute', }}>
                        <Line
                            x1="0"
                            y1={height}
                            x2={(ml) + this.x}
                            y2={(innerHeight + mt) + this.y}
                            stroke="black"
                            strokeWidth="1"
                        />
                    </Svg>
                    <Svg height={height} width={width} style={{ position: 'absolute', }}>
                        <Line
                            x1={width}
                            y1={height}
                            x2={(innerWidth + ml) + this.x}
                            y2={(innerHeight + mt) + this.y}
                            stroke="black"
                            strokeWidth="1"
                        />
                    </Svg>

                </View>
            </View>
        )
    }
}