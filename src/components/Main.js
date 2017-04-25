require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';
import ReactDOM from 'react-dom';

let imageDatas = require('json!../data/imageDatas.json');

imageDatas = ((imageDatasArr) => {
	for(var i = 0, j = imageDatasArr.length; i < j; i++){
		let singleImageData = imageDatasArr[i];
		singleImageData.imageURL = require('../images/' + singleImageData.fileName);
		imageDatasArr[i] = singleImageData;
	}
	return imageDatasArr;
})(imageDatas);

//獲取區間內的一個隨機值
var getRangeRandom = (low, high) => Math.floor(Math.random() * (high - low) + low);
//獲取0~30度 之間的一個任意正負值
var get30DegRandom = () => {
	let deg = '';
	deg = (Math.random() > 0.5) ? '+' : '-';
	return deg + Math.floor(Math.random() * 30);
}

// 單個圖片組件
class ImgFigure extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	//imgFigure 的點擊處理函數
	handleClick (e) {
		if(this.props.arrange.isCenter) {
			this.props.inverse();
		}else{
			this.props.center();
		}
		
		e.stopPropagation();
		e.preventDefault();
	}

	render() {

		var styleObj = {};

		//如果props屬性中指定了這張圖片的位置，則使用
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos;
		}

		// 如果圖片的旋轉角度有值且不為0ㄝ, 添加旋轉角度
		if(this.props.arrange.rotate) {
			['Moz', 'ms', 'Webkit', ''].forEach((value) => {
				styleObj[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			})
		}

		if(this.props.arrange.isCenter) {
			styleObj.zIndex = '11';
		}

		let imgFigureClassName = 'img-figure';
		imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

		return (
			<figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
				<img src={this.props.data.imageURL}
					 alt={this.props.data.title}
				/>
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
					<div className="img-back" onClick={this.handleClick}>
						<p>
							{this.props.data.desc}
						</p>
					</div>
				</figcaption>
			</figure>
		);
	}

}

class ControllerUnit extends React.Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick(e) {
		//如果點擊的是當前正在選中態的按鈕，則翻轉圖片，否則將對應的圖片居中
		if(this.props.arrange.isCenter) {
			this.props.inverse();
		}else{
			this.props.center();
		}
		e.stopPropagation();
		e.preventDefault();
	}

	render () {
		let controllerUnitClassName = 'controller-unit';
		//如果對應的是居中的圖片，顯示控制按鈕的居中狀態
		if(this.props.arrange.isCenter) {
			controllerUnitClassName += ' is-center';
			//如果翻轉則顯示翻轉狀態
			if(this.props.arrange.isInverse) {
				controllerUnitClassName += ' is-inverse';
			}
		}
		return (
			<span className={controllerUnitClassName} onClick={this.handleClick}>				
			</span>
		);
	}
}

class AppComponent extends React.Component {
	constructor(props){
		super(props);
		this.Constant = {
			centerPos: {
				left: 0,
				right: 0
			},
			hPosRange: { // 水平方向的取值範圍
				leftSecX: [0, 0],
				rightSecX: [0, 0],
				y: [0, 0]
			},
			vPosRange: { // 垂直方向
				x: [0, 0],
				topY: [0, 0]
			}
		};
		this.state = {
			imgsArrangeArr: [
				// {
				// 	pos:{
				// 		left: 0,
				// 		top: 0
				// 	},
				//	rotate: 0, //旋轉角度
				//	isInverse: false, // 圖片正反面
				//  isCenter: false //圖片是否居中
				// }
			]
		};
	}

	// 翻轉圖片函數
	
	inverse(index) {
		return () => {
			let imgsArrangeArr = this.state.imgsArrangeArr;
			imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
			this.setState({
				imgsArrangeArr: imgsArrangeArr
			})
		}
	}

	// 重新布局所有圖片
	// @param centerIndex 指定居中哪張圖片
	rearrange(centerIndex) {
		let imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,
			imgsArrangeTopArr = [],
			topImgNum = Math.floor(Math.random() * 2),
			topImgSpliceIndex = 0,
			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

			//首先居中 centerIndex 的圖片
			imgsArrangeCenterArr[0] ={
				pos: centerPos,
				rotate: 0,
				isCenter: true
			} 			

			//取出要布局上側的圖片狀態信息
			topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

			//布局位於上側的圖片
			imgsArrangeTopArr.forEach((value, index) => {
				imgsArrangeTopArr[index] = {
					pos: {
						top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
						left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
					},
					rotate: get30DegRandom(),
					isCenter: false
				};
			});

			//布局左右兩側的圖片
			for(var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++){
				var hPosRangeLORX = null;

				// 前半部分布局左邊， 右半部分布局右邊
				if(i < k){
					hPosRangeLORX = hPosRangeLeftSecX;
				}else{
					hPosRangeLORX = hPosRangeRightSecX;
				}

				imgsArrangeArr[i] = {
					pos:{
						top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
						left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
					},
					rotate: get30DegRandom(),
					isCenter: false
				}
			}

			if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
				imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
			}

			imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});
	}

	// 利用rearrange函數, 居中對應index的圖片
	center(index) {
		return () => {
			this.rearrange(index);
		}
	}

	//組件加載以後， 為每張圖片計算其位置的範圍
	componentDidMount() {
		//首先拿到舞台的大小
		let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.floor(stageW / 2),
			halfStageH = Math.floor(stageH / 2);
		//拿到一個imageFigure的大小
		let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
			imgW = imgFigureDOM.scrollWidth,
			imgH = imgFigureDOM.scrollHeight,
			halfImgW = Math.floor(imgW / 2),
			halfImgH = Math.floor(imgH / 2);
		// 計算中心圖片位置點
		this.Constant.centerPos = {
			left: halfStageW - halfImgW,
			top: halfStageH - halfImgH
		}
		// 計算左側及右側區域圖片的排布取值範圍
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;

		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;

		this.Constant.hPosRange.y[0] = -halfImgH;
		this.Constant.hPosRange.y[1] = stageH - halfImgH;
		// 計算上側區域圖片的排布取值範圍
		this.Constant.vPosRange.topY[0] = -halfImgH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;

		this.Constant.vPosRange.x[0] = halfStageW - imgW;
		this.Constant.vPosRange.x[1] = halfStageW;
		let num = Math.floor(Math.random() * 10);
		this.rearrange(num);
	}
  render() {

  	var controllerUnits = [],
  		imgFigures = [];

  	imageDatas.forEach((value, index) => {

  		if(!this.state.imgsArrangeArr[index]){
  			this.state.imgsArrangeArr[index] = {
  				pos:{
				 		left: 0,
				 		top: 0
				},
				rotate: 0,
				isInverse: false,
				isCenter: false
  			}
  		}

  		imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure'+index}
  						arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);

  		controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} 
  											 inverse={this.inverse(index)} center={this.center(index)}/>);
  	})

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
