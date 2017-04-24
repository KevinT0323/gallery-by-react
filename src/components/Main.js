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

class AppComponent extends React.Component {
  render() {
    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          
        </section>
        <nav className="controller-nav">
          
        </nav>
      </section>
    );
  }
}

AppComponent.defaultProps = {
};

export default AppComponent;
