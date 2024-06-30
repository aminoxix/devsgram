import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Image, StyleSheet, Platform } from "react-native";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { PostDTO } from "../../../backend/src/post/dto/post.dto";

export default function HomeScreen() {
  const [draftPosts, setDraftPosts] = useState<PostDTO[]>([]);
  const [publishedPosts, setPublishedPosts] = useState<PostDTO[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_ENDPOINT}/post/published`
        );
        const data = await response.json();
        setPublishedPosts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_ENDPOINT}/post/drafts`
        );
        const data = await response.json();
        setDraftPosts(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/partial-react-logo.png")}
          style={styles.reactLogo}
        />
      }
    >
      <ThemedView style={styles.stepContainer}>
        <ThemedView style={styles.titleContainer}></ThemedView>
        <ThemedText type="subtitle">Published</ThemedText>
        <ThemedView>
          {publishedPosts.map((post) => (
            <PostCard key={post.id} data={post} />
          ))}
        </ThemedView>
        <ThemedText type="subtitle">Drafts</ThemedText>
        <ThemedView>
          {draftPosts.map((post) => (
            <PostCard key={post.id} data={post} />
          ))}
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
