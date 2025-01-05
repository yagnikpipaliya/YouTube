import React, { useEffect, useState } from "react";
import { Row, Col, Table } from "react-bootstrap";
import Card from "../../components/Card";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { viewConvertor } from "../../utils/utilsFunc";
import * as moment from "moment";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";

const VideoPage = () => {
  const navigate = useNavigate();
  const { categoryId, videoId } = useParams();
  // const selectedVideo = useSelector((state)=>state.youtube.selectedVideo)
  const [selectedVideo, setSelectedVideo] = useState(JSON.parse(sessionStorage.getItem("video")));

  const [videos, setVideos] = useState([]); // Store fetched videos
  const [nextPageToken, setNextPageToken] = useState(null); // Store next page token
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [channelImages, setChannelImages] = useState({});

  const API_KEY = process.env.REACT_APP_API_KEY;
  const VIDEOS_API_URL = process.env.REACT_APP_VIDEOS_API_URL;
  const CHANNELS_API_URL = process.env.REACT_APP_CHANNELS_API_URL;
  const MAX_RESULTS = 12; // Number of videos per request

  // Fetch channel data by ID
  const fetchChannelData = async (channelId) => {
    try {
      const response = await axios.get(CHANNELS_API_URL, {
        params: {
          part: "snippet,contentDetails,statistics",
          id: channelId,
          key: API_KEY,
        },
      });
      const channelData = response.data.items[0];
      return channelData?.snippet?.thumbnails?.default?.url || "";
    } catch (err) {
      console.error("Failed to fetch channel data", err);
      return "";
    }
  };

  // Fetch YouTube API Data
  const fetchVideos = async (pageToken = null) => {
    // if (loading || (pageToken === null && videos.length > 0)) return;
    try {
      setLoading(true);
      let params = {
        part: "snippet,contentDetails,statistics",
        maxResults: MAX_RESULTS,
        regionCode: "IN",
        key: API_KEY,
        videoCategoryId: categoryId,
        pageToken,
      };

      if ([0, 2, 10, 17, 18, 20, 23, 24, 25, 28, 30, 42, 44].includes(Number(categoryId))) {
        params = {
          ...params,
          chart: categoryId == 0 ? "mostPopular" : "mostPopular",
        };
      }

      const response = await axios.get(VIDEOS_API_URL, { params });
      const newVideos = response.data.items;

      // Fetch channel profile images for each video
      for (const video of newVideos) {
        const channelId = video.snippet.channelId;
        if (!channelImages[channelId]) {
          const profileImage = await fetchChannelData(channelId);
          setChannelImages((prev) => ({ ...prev, [channelId]: profileImage }));
        }
      }
      setVideos((prevVideos) => [...prevVideos, ...newVideos]);
      setNextPageToken(response.data.nextPageToken || null);
    } catch (err) {
      setError("Failed to load videos. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      // console.log('categoryId useEffect', categoryId, prevCategoryId.current)
      // if (categoryId !== prevCategoryId.current) { 
      //   prevCategoryId.current = categoryId;
        setVideos([])
        fetchVideos(); // Initial fetch only once
      // }
    }, [categoryId]);

  const handleCardClick = (video, channelImages) => {
    video = { ...video, channelImages: channelImages };
    const { id, snippet, etag, statistics } = video;
    const { title, description, thumbnails, publishedAt, channelTitle, categoryId, channelId } = snippet;
    // dispatch(setSelectedVideo(video));
    sessionStorage.setItem("video", JSON.stringify(video));

    window.open(`${categoryId}/${id}`, "_blank");
  };

  const handleBackClick = () => {
    if (window.history.state && window.history.state.idx > 0) {
      window.history.back();
    } else {
      navigate("/");
    }
  };
  return (
    <>
          <div onClick={handleBackClick} className="mb-3" style={{ cursor: "pointer", color: "blue", fontSize: "large" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" />
            </svg>
            back
          </div>
      <Row className="">
        <Col lg="8" md="7" sm="12" className="">
          {/* <iframe
            width="100%"
            // height="400"
            // height="100%"
            // src="https://www.youtube.com/embed/nEQRMmtAG00?si=HdBy4_AyJEP8zk1U"
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
            style={{ height: "37vw" }}
          ></iframe> */}

          <div className="card video-card">
            {/* data-aos="fade-up" data-aos-delay="00" onClick={() => handleCardClick(video)} */}
            {/* credit-card-widget */}
            <div className="border-0 card-header">
              {/* pb-4  */}
              <iframe
                width="100%"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="YouTube video player"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerpolicy="strict-origin-when-cross-origin"
                allowfullscreen
                style={{ height: "37vw" }}
              ></iframe>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <div className="d-flex justify-content-start">
                  {/* flex-wrap  */}
                  <img
                    src={
                      selectedVideo?.channelImages ||
                      "https://yt3.ggpht.com/WrjDeIWr2pmRdCKFuEDfvkovr0O_o7gyfT_J_AMJjFk5KR9HGQVirOP0DeimyAoBUHRfH79X=s68-c-k-c0x00ffffff-no-rj" ||
                      "https://via.placeholder.com/36"
                    }
                    className="rounded-circle me-2"
                    alt="Logo"
                    style={{ height: "36px", width: "36px", objectFit: "fill" }}
                  />
                  <div>
                    <h6 className="mb-1 video-title">{selectedVideo?.snippet?.title || "Title"}</h6>
                    <div className="fs-14 text-muted">
                      {selectedVideo?.snippet?.channelTitle || "Channel Title"}{" "}
                      <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 0 24 24" width="14" focusable="false" fill="#606060" aria-hidden="true">
                        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zM9.8 17.3l-4.2-4.1L7 11.8l2.8 2.7L17 7.4l1.4 1.4-8.6 8.5z"></path>
                      </svg>
                    </div>
                    <div className="fs-14 text-muted">
                      <span>{viewConvertor(selectedVideo?.statistics?.viewCount)} views</span>
                      <span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dot" viewBox="0 0 16 16">
                          <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                        </svg>
                      </span>
                      <span>{moment(selectedVideo?.snippet?.publishedAt).fromNow()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col lg="4" md="5" sm="12" className="">
        <div id="scrollableDiv" style={{ height: "calc(100vh - 7rem)", overflow: "auto" }}>
        {/* "calc(100vh - 6.6rem)" */}
          <InfiniteScroll
            dataLength={videos.length} // This is the number of items loaded
            next={() => fetchVideos(nextPageToken)} // Fetch next page
            hasMore={!!nextPageToken} // Determines if more items should be loaded
            scrollableTarget="scrollableDiv"
            loader={
              <div className="d-flex align-items-center justify-content-center">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
            } // Loading indicator
            endMessage={""} // Message when no more data
            // endMessage={<p>No more videos to show.</p>} // Message when no more data
            className="overflow-visible"
          >
            <Row className="mt-5 m-0">
              {videos.map((video, i) => {
                const { id, snippet, etag, statistics } = video;
                const { title, description, thumbnails, publishedAt, channelTitle, categoryId, channelId } = snippet;
                return (
                  <Col md="12" lg="12" sm="12" key={i}>
                    {/* <Link to={`${categoryId}/${id}`} target="_parent"> */}
                    <div className="card video-card"  onClick={() => handleCardClick(video, channelImages[channelId])}>
                      {/* data-aos="fade-up" data-aos-delay="00" credit-card-widget */}
                      <div className="border-0 card-header">
                        {/* pb-4  */}
                        <img
                          src={thumbnails?.maxres?.url || thumbnails?.medium?.url}
                          // src="https://i.ytimg.com/vi/kkWgk_tZtRA/hq720.jpg?sqp=-oaymwEnCNAFEJQDSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLBxJSB8jAhtmi2uMzs33lKnAEsQBQ"
                          className="w-100 rounded-3"
                          alt="Video Thumbnail"
                          style={{ objectFit: "cover" }}
                          loading={videos.length < 15 ? "eager" : "lazy"}
                        />
                      </div>
                      <div className="card-body">
                        <div className="mb-4">
                          <div className="d-flex justify-content-start">
                            {/* flex-wrap  */}
                            <img
                              src={
                                channelImages[channelId] ||
                                "https://yt3.ggpht.com/WrjDeIWr2pmRdCKFuEDfvkovr0O_o7gyfT_J_AMJjFk5KR9HGQVirOP0DeimyAoBUHRfH79X=s68-c-k-c0x00ffffff-no-rj" ||
                                "https://via.placeholder.com/36"
                              }
                              className="rounded-circle me-2"
                              alt="Logo"
                              style={{ height: "36px", width: "36px", objectFit: "fill" }}
                            />
                            <div>
                              <h6 className="mb-1 video-title">{title || "Title"}</h6>
                              <div className="fs-14 text-muted">
                                {channelTitle || "Channel Title"}{" "}
                                <svg xmlns="http://www.w3.org/2000/svg" height="14" viewBox="0 0 24 24" width="14" focusable="false" fill="#606060" aria-hidden="true">
                                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zM9.8 17.3l-4.2-4.1L7 11.8l2.8 2.7L17 7.4l1.4 1.4-8.6 8.5z"></path>
                                </svg>
                              </div>
                              <div className="fs-14 text-muted">
                                <span>{viewConvertor(statistics?.viewCount)} views</span>
                                <span>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dot" viewBox="0 0 16 16">
                                    <path d="M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
                                  </svg>
                                </span>
                                <span>{moment(publishedAt).fromNow()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* </Link> */}
                  </Col>
                );
              })}
            </Row>
          </InfiniteScroll>
          </div>
        </Col>
      </Row>
      {/* <Row className="">
        <Col lg="12" className="">
          <Card className="rounded">
            <Card.Body className="">
              <Row className="">
                <Col sm="12" className="">
                  <h4 className="mb-2">Invoice #215462</h4>
                  <h5 className="mb-3">Hello , Devon Lane </h5>
                  <p>
                    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem
                    Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable
                    English.
                  </p>
                </Col>
              </Row>
              <Row className="">
                <Col sm="12" className=" mt-4">
                  <div className="table-responsive-lg">
                    <Table className="">
                      <thead>
                        <tr>
                          <th scope="col">Item</th>
                          <th className="text-center" scope="col">
                            Quantity
                          </th>
                          <th className="text-center" scope="col">
                            Price
                          </th>
                          <th className="text-center" scope="col">
                            Totals
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <h6 className="mb-0">Item 1</h6>
                            <p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                          </td>
                          <td className="text-center">5</td>
                          <td className="text-center">$120.00</td>
                          <td className="text-center">$2,880.00</td>
                        </tr>
                        <tr>
                          <td>
                            <h6 className="mb-0">Item 2</h6>
                            <p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                          </td>
                          <td className="text-center">5</td>
                          <td className="text-center">$120.00</td>
                          <td className="text-center">$2,880.00</td>
                        </tr>
                        <tr>
                          <td>
                            <h6 className="mb-0">Item 1</h6>
                            <p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                          </td>
                          <td className="text-center">5</td>
                          <td className="text-center">$120.00</td>
                          <td className="text-center">$2,880.00</td>
                        </tr>
                        <tr>
                          <td>
                            <h6 className="mb-0">Item 1</h6>
                            <p className="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                          </td>
                          <td className="text-center">5</td>
                          <td className="text-center">$120.00</td>
                          <td className="text-center">$2,880.00</td>
                        </tr>
                        <tr>
                          <td>
                            <h6 className="mb-0">Total</h6>
                          </td>
                          <td className="text-center"></td>
                          <td className="text-center"></td>
                          <td className="text-center">$2,880.00</td>
                        </tr>
                        <tr>
                          <td>
                            <h6 className="mb-0">Taxs</h6>
                          </td>
                          <td className="text-center"></td>
                          <td className="text-center"></td>
                          <td className="text-center">$2,880.00</td>
                        </tr>
                        <tr>
                          <td>
                            <h6 className="mb-0">Discount</h6>
                          </td>
                          <td className="text-center"></td>
                          <td className="text-center"></td>
                          <td className="text-center">$2,880.00</td>
                        </tr>
                        <tr>
                          <td>
                            <h6 className="mb-0">Net Amount</h6>
                          </td>
                          <td className="text-center"></td>
                          <td className="text-center"></td>
                          <td className="text-center">
                            <b>$2,880.00</b>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm="12">
                  <p className="mb-0 mt-4">
                    <svg width="30" className="text-primary mb-3 me-2" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="-0.757324" y="19.2427" width="28" height="4" rx="2" transform="rotate(-45 -0.757324 19.2427)" fill="currentColor" />
                      <rect x="7.72803" y="27.728" width="28" height="4" rx="2" transform="rotate(-45 7.72803 27.728)" fill="currentColor" />
                      <rect x="10.5366" y="16.3945" width="16" height="4" rx="2" transform="rotate(45 10.5366 16.3945)" fill="currentColor" />
                      <rect x="10.5562" y="-0.556152" width="28" height="4" rx="2" transform="rotate(45 10.5562 -0.556152)" fill="currentColor" />
                    </svg>
                    It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem
                    Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable
                    English.
                  </p>
                  <div className="d-flex justify-content-center mt-4">
                    <button type="button" className="btn btn-primary">
                      Print
                    </button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row> */}
    </>
  );
};

export default VideoPage;
