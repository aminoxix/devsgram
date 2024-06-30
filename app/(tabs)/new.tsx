import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { Alert, Button, StyleSheet, TextInput } from "react-native";
import { useForm, Controller } from "react-hook-form";
import * as DocumentPicker from "expo-document-picker";
import { useState } from "react";
import { PostDTO } from "../../../backend/src/post/dto/post.dto";
import { ThemedView } from "@/components/ThemedView";
import { styled } from "nativewind";

const NewPost = () => {
  const StyledButton = styled(Button);

  const { control, handleSubmit } = useForm();
  const [assets, setAssets] = useState<string[]>([]);

  const form = useForm<PostDTO>({
    defaultValues: {
      title: "",
      content: "",
      assets: [],
      published: false,
    },
    mode: "onChange",
  });

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*", "video/*", "audio/*"],
      });
      const file:
        | FormData
        | {
            uri: string;
            name: string;
            type: string;
          } = new FormData();
      if (!result.assets) return;
      const assets = result.assets[0];
      file.append("file", {
        uri: assets.uri,
        name: assets.name,
        type: assets.mimeType?.toLowerCase() ?? "",
      } as any);
      if (!assets) return;
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_ENDPOINT}/asset/upload`,
        {
          method: "POST",
          body: JSON.stringify({
            fileName: assets.name,
          }),
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
      const url = await response.text();
      if (!url) return;
      const res = await fetch(url ?? "", {
        method: "PUT",
        body: file,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": String("type" in file ? file.type : ""),
          "x-ms-blob-type": "BlockBlob",
          mode: "no-cors",
        },
      });
      console.log(res.url);
      setAssets((prev) => [...prev, res.url]);
    } catch (e) {
      console.error(e);
    }
  };

  // const onSubmit = async (data: PostDTO) => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.EXPO_PUBLIC_BACKEND_ENDPOINT}/post/create`,
  //       {
  //         method: "POST",
  //         body: JSON.stringify(data),
  //         headers: {
  //           "Content-Type": "application/json",
  //           "Access-Control-Allow-Origin": "*",
  //         },
  //       }
  //     );
  //     const res = await response.text();
  //     console.log(res);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // };

  const onSubmit = (published: boolean) =>
    handleSubmit(async (data) => {
      try {
        const response = await fetch(
          `${process.env.EXPO_PUBLIC_BACKEND_ENDPOINT}/post/create`,
          {
            method: "POST",
            body: JSON.stringify({
              ...data,
              assets,
              published,
              authorId: "clxqfye9g00007cwxesm2v0mu",
            }),
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
        const res = await response.text();
        console.log(res);
      } catch (e) {
        console.error(e);
      }
    });

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="code-slash" style={styles.headerImage} />
      }
    >
      <ThemedText type="title">New Post</ThemedText>
      <ThemedText type="subtitle">Title</ThemedText>
      <Controller
        control={control}
        name="title"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              padding: 10,
            }}
            placeholder="Title"
          />
        )}
      />
      <ThemedText type="subtitle">Content</ThemedText>
      <Controller
        control={control}
        name="content"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            style={{
              height: 40,
              borderColor: "gray",
              borderWidth: 1,
              padding: 10,
            }}
            placeholder="Write your thoughts..."
          />
        )}
      />
      <ThemedText type="subtitle">Assets</ThemedText>
      <Button title="Pick Document" onPress={pickDocument} />
      <ThemedView style={styles.buttonContainer}>
        <StyledButton title="Drafts" onPress={onSubmit(false)} />
        <StyledButton
          title="Publish"
          className="text-green-500"
          onPress={onSubmit(true)}
        />
        <StyledButton
          title="Discard"
          className="text-red-500"
          onPress={() => form.reset()}
        />
      </ThemedView>
    </ParallaxScrollView>
  );
};

export default NewPost;

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 2,
  },
});
