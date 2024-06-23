import { Dimensions, Image, Text } from "react-native";
import { ThemedView } from "./ThemedView";
import Carousel from "react-native-reanimated-carousel";
import { PostDTO } from "../../backend/src/post/dto/post.dto";
const PostCard = ({ data }: { data: PostDTO }) => {
  const width = Dimensions.get("window").width;
  return (
    <ThemedView>
      {data.title && <Text>{data.title}</Text>}
      {data.content && <Text>{data.content}</Text>}
      {data.assets.length ? (
        <Carousel
          loop
          width={width}
          height={width / 2}
          autoPlay={true}
          data={data.assets}
          scrollAnimationDuration={1000}
          onSnapToItem={(index) => console.log("current index:", index)}
          renderItem={({ index }) => (
            <ThemedView
              style={{
                flex: 1,
                borderWidth: 1,
                justifyContent: "center",
              }}
            >
              <Image
                source={{ uri: data.assets[index] }}
                style={{ width: width, height: width / 2 }}
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
