"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import PromptCard from "./PromptCard";
import LoadingIndicator from "./LoadingIndicator";

const PromptCardList = ({ data, handleTagClick }) => {
  return (
    <div className="prompt_layout mt-16">
      {data && data.length > 0 ? (
        data.map((post) => (
          <PromptCard
            key={post._id}
            post={post}
            handleTagClick={handleTagClick}
          />
        ))
      ) : (
        <LoadingIndicator showLabel />
      )}
    </div>
  );
};

const Feed = () => {
  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const deferredSearchText = useDeferredValue(searchText);

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    if (deferredSearchText === "") return posts;
    const regex = new RegExp(deferredSearchText, "i");

    return posts.filter(({ prompt, creator: { username }, tag }) => {
      return regex.test(prompt) || regex.test(tag) || regex.test(username);
    });
  }, [deferredSearchText, posts]);

  return (
    <section className="feed">
      <form className="relative w-full flex-center">
        <input
          type="text"
          placeholder="Search for a tag or a username"
          value={searchText}
          onChange={handleSearchChange}
          required
          className="search_input peer"
        />
      </form>
      <PromptCardList
        data={filteredPosts}
        handleTagClick={(tag) => {
          setSearchText(tag);
        }}
      />
    </section>
  );
};

export default Feed;
