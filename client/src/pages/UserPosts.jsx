import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { logOutUser } from "../redux/userReducer";

const UserPosts = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `/api/v1/user/get-posts?page=${currentPage}`
        );
        setPosts((prevPosts) => [...prevPosts, ...response.data.posts.results]);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
      setLoading(false);
    };

    if (!loading) {
      fetchPosts();
    }
  }, [currentPage, loading]);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="fixed right-0 pr-4">
        <button
          className={`bg-[#cb4154] transition-all duration-200 ease-in-out text-white px-4 py-2 rounded-md`}
          onClick={() => dispatch(logOutUser())}
        >
          Log out
        </button>
      </div>
      <div className="container mx-auto px-4 py-8 ">
        {posts.map((post, index) => (
          <div key={index} className="max-w-4xl mx-auto mb-8">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
              <img
                className="w-full h-64 object-cover object-center"
                src={post.urlToImage}
                alt={post.title}
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
                <p className="text-gray-700">{post.description}</p>
                <div className="flex items-center mt-4">
                  <img
                    className="w-10 h-10 rounded-full mr-4"
                    src="https://via.placeholder.com/150"
                    alt="Author"
                  />
                  <div>
                    <p className="text-gray-900 font-semibold">{post.author}</p>
                    <p className="text-gray-600">{post.publishedAt}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <a
                    href={post.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Read More
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
        {loading && <p>Loading...</p>}
      </div>
    </>
  );
};

export default UserPosts;
