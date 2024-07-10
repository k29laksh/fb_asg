import React, { useState } from "react";
import "../App.css";
import FacebookLogin from "react-facebook-login";
import axios from "axios";

const Home = () => {
  const [userData, setUserData] = useState(null);
  const [pages, setPages] = useState([]);
  const [pageInsights, setPageInsights] = useState(null);

  const responseFacebook = (response) => {
    setUserData(response);
    fetchPages(response.accessToken);
  };

  const fetchPages = async (token) => {
    try {
      const res = await axios.get(
        `https://graph.facebook.com/me/accounts?access_token=${token}`
      );
      setPages(res.data.data);
    } catch (error) {
      alert("Error fetching pages:", error);
      console.error("Error fetching pages:", error);
      setPages([]); 
    }
  };

  const fetchPageInsights = async (pageId, token) => {
    const since = "2024-01-01"; 
    const until = "2024-12-31";  
    const period = "day"; 
  
    try {
      const res = await axios.get(`https://graph.facebook.com/v20.0/${pageId}/insights`, {
        params: {
          metric: "page_fans,page_engaged_users,page_impressions,page_reactions",
          since: since,
          until: until,
          period: period,
          access_token: token
        }
      });
      setPageInsights(res.data.data);
    } catch (error) {
      alert("Error fetching page insights:", error);
      console.error("Error fetching page insights:", error);
      setPageInsights(null); 
    }
  };

  return (
    <div className="App">
      {!userData ? (
        <FacebookLogin
          appId="490388526811923"
          autoLoad={true}
          fields="name,email,picture"
          scope="public_profile,email,pages_show_list,pages_read_engagement"
          callback={responseFacebook}
        />
      ) : (
        <div className="userdata">
          <h1>Welcome, {userData.name}</h1>
          <img src={userData.picture.data.url} alt="Profile" />
          <select
            onChange={(e) =>
              fetchPageInsights(e.target.value, pages.access_token)
            }
          >
            <option value="">Select a Page</option>
            {pages.map((page) => (
              <option key={page.id} value={page.id}>
                {page.name}
              </option>
            ))}
          </select>
          {pageInsights && (
            <div>
              {pageInsights.map((insight) => (
                <div key={insight.name}>
                  <h3>{insight.title}</h3>
                  <p>{insight.description}</p>
                  <p>{insight.values[0].value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
