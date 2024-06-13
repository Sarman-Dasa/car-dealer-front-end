import React from 'react';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import image1 from '../image/silderImage1.jpg';
import image2 from '../image/silderImage2.jpg';
import image3 from '../image/silderImage3.jpg';
import { FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";

const spanStyle = {
  padding: '20px',
  background: 'transmission',
  color: '#000000',
  fontSize:'24px',
  fontWeight:600,
};

const properties = {
    prevArrow: <FaAnglesLeft className='text-primary'/>,
    nextArrow: <FaAnglesRight className='text-primary'/>
}

const divStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundSize: 'cover', 
  backgroundPosition: 'center', 
  backgroundRepeat: 'no-repeat',
  height: '800px'
};

const slideImages = [
  {
    url: image1,
    caption: 'Feel the engine, live the dream'
  },
  {
    url: image2,
    caption: 'Slide 2'
  },
  {
    url: image3,
    caption: 'Slide 3'
  },
];

export default function Slideshow() {
    return (
      <div className="slide-container">
        <Slide {...properties}>
         {slideImages.map((slideImage, index)=> (
            <div key={index}>
              <div style={{ ...divStyle, 'backgroundImage': `url(${slideImage.url})`}}>
                <span style={spanStyle}>{slideImage.caption}</span>
              </div>
            </div>
          ))} 
        </Slide>
      </div>
    )
}
