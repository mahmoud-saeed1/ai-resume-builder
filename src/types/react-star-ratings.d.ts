declare module 'react-star-ratings' {
    import React from 'react';
  
    interface StarRatingsProps {
      rating: number;
      starRatedColor?: string;
      starHoverColor?: string;
      changeRating: (newRating: number) => void;
      numberOfStars?: number;
      name?: string;
      starDimension?: string;
      starSpacing?: string;
      isAggregate?: boolean;
    }
  
    export default class StarRatings extends React.Component<StarRatingsProps> {}
  }
  