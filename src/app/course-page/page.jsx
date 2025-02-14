"use client"

import React from 'react'
import Header from '../component/L_Header'
import VidSideBar from '../component/VidSideBar'
import VideoPlayer from '../component/localVideoPlayer.jsx'

const page = () => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    console.log("Client mount - setting isClient to true")
    setIsClient(true);
  }, []);

  const courseData = [{"chapter_number":1,"chapter_name":"Probability Theory","lectures":[{"lecture_id":50,"lecture_number":1,"lecture_title":"Introduction to Probability Theory","lecture_path":"https://www.youtube.com/watch?v=fxY1pHfaYco"},{"lecture_id":51,"lecture_number":2,"lecture_title":"Bernoulli Trials and Bernoulli’s Theorem","lecture_path":"https://www.youtube.com/watch?v=uWY76y1juh8"},{"lecture_id":52,"lecture_number":3,"lecture_title":"Random Variables","lecture_path":"https://www.youtube.com/watch?v=Qy48SEzc-9M"},{"lecture_id":53,"lecture_number":4,"lecture_title":"Conditional Distribution and Bayes theorem","lecture_path":"https://www.youtube.com/watch?v=DkDwFO5_AGU"},{"lecture_id":54,"lecture_number":5,"lecture_title":"Function of a Random Variable","lecture_path":"https://www.youtube.com/watch?v=Kq5dDa3qdvI"},{"lecture_id":55,"lecture_number":6,"lecture_title":"Mean and Variance of random variable","lecture_path":"https://www.youtube.com/watch?v=qAN0BX4EQO8"},{"lecture_id":56,"lecture_number":7,"lecture_title":"Moments and Characteristic Function","lecture_path":"https://www.youtube.com/watch?v=5xVMAugmwDU"},{"lecture_id":57,"lecture_number":8,"lecture_title":"Function of Two Random Variables","lecture_path":"https://www.youtube.com/watch?v=d6xfoAUvXns"},{"lecture_id":58,"lecture_number":9,"lecture_title":"Joint Moments and Joint Characteristic Functions","lecture_path":"https://www.youtube.com/watch?v=EaSWSKgrleY"},{"lecture_id":59,"lecture_number":10,"lecture_title":"Conditional Distributions and Conditional Expected Values","lecture_path":"https://www.youtube.com/watch?v=13egjY99Nvc"},{"lecture_id":60,"lecture_number":11,"lecture_title":"Central Limit Theorem","lecture_path":"https://www.youtube.com/watch?v=lG4AUsHIQls"}]},{"chapter_number":3,"chapter_name":"Stochastic Processes","lectures":[{"lecture_id":61,"lecture_number":1,"lecture_title":"Stochastic Process","lecture_path":"https://www.youtube.com/watch?v=CjGn6ij5gkc"},{"lecture_id":62,"lecture_number":2,"lecture_title":"Stationary Process","lecture_path":"https://www.youtube.com/watch?v=QAp09jQOUd0"},{"lecture_id":63,"lecture_number":3,"lecture_title":"Gaussian Process & PSD","lecture_path":"https://www.youtube.com/watch?v=blJzp_4VldU"},{"lecture_id":64,"lecture_number":4,"lecture_title":"LTI systems with random inputs","lecture_path":"https://www.youtube.com/watch?v=_R77mx-EaWk"},{"lecture_id":65,"lecture_number":5,"lecture_title":"Ergodicity and Noise","lecture_path":"https://www.youtube.com/watch?v=EONypaseCI8"},{"lecture_id":66,"lecture_number":6,"lecture_title":"Random Walk Model","lecture_path":"https://www.youtube.com/watch?v=3aWtKdBZL60"},{"lecture_id":67,"lecture_number":7,"lecture_title":"Markov Chains","lecture_path":"https://www.youtube.com/watch?v=PWZF1r9w_xw"},{"lecture_id":68,"lecture_number":8,"lecture_title":"Mean square estimation","lecture_path":"https://www.youtube.com/watch?v=9VxhRqhNw6M"}]}]

  return (
    <>
      <Header heading="Information and Communication Theory"/>
      <div style={{display:"flex"}}> 
        <VidSideBar course_data={courseData} course_id={35} />
        <div style={{ maxWidth: "1040px"}}>
            {isClient ? <VideoPlayer src="/videos/video1.mp4" /> : <p>Loading video...</p>}
        </div>
      </div>
    </>
  )
}

export default page


