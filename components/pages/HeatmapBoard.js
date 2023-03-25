import React from 'react';
import useFetch from 'hooks/useFetch';

export default function HeatmapBoard({ id }) {
    const [websiteId] = id;

    const {data} = useFetch(`/screenshot/${websiteId}/all`, {image:true, params: {
        url: "/dashboard",
      }})

    if(!data) {
        return null
    }
    
    const imageObjectURL = URL.createObjectURL(data);



    return (
        <div style={{overflowY:"auto", height: "37vw", width:"100%", position: "relative"}}>
            <img src={imageObjectURL} style={{position: "absolute", left:0, top: 0, width: "100%"}}/>
        </div>
      );

}