import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

import { Dimensions, Image } from "react-native";
import Carousel from "react-native-reanimated-carousel";

import { PostDTO } from "../../backend/src/post/dto/post.dto";

const PostCard = ({ data }: { data: PostDTO }) => {
  const width = Dimensions.get("window").width;
  return (
    <ThemedView
      style={{
        margin: 10,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "#D3D3D3",
      }}
    >
      {data.title && (
        <ThemedText type="defaultSemiBold">{data.title}</ThemedText>
      )}
      {data.content && <ThemedText type="default">{data.content}</ThemedText>}
      {data.assets.length ? (
        <Carousel
          loop
          key={data.id}
          width={width - 105}
          autoPlay={true}
          mode="parallax"
          height={width / 2}
          data={data.assets}
          scrollAnimationDuration={1000}
          // onSnapToItem={(index) => console.log("current index:", index)}
          renderItem={({ index }) => (
            <ThemedView
              style={{
                borderRadius: 10,
                justifyContent: "center",
              }}
            >
              <Image
                source={{ uri: data.assets[index] }}
                style={{ width: width - 105, height: width / 2 }}
              />
            </ThemedView>
          )}
        />
      ) : (
        <></>
      )}
    </ThemedView>
  );
};

export default PostCard;
