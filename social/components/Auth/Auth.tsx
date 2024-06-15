import { useToggle, upperFirst } from '@mantine/hooks';
import React, { useState } from 'react';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
} from '@mantine/core';
import classes from './Auth.module.css'
import { GoogleButton } from './GoogleButton';
import { auth, GoogleAuthProvider, signInWithPopup } from "../../firebase/config/Firebase";
import { collection, doc, setDoc, getFirestore, DocumentData , getDoc } from 'firebase/firestore';
import { User } from '../../firebase/Models/User';
import { Request } from '@/firebase/Models/Request';

const db = getFirestore();

const Auth = (props: PaperProps) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [type, toggle] = useToggle(['login', 'register']);
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },

    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      // Check if the user exists in the Firestore database
      const userId = result.user!.uid;
      const userDoc = doc(db, 'users', userId);
      const userSnap = await getDoc(userDoc);

      if (!userSnap.exists()) {
        // Create a new document for the user if not exist
        const newUser: User = {
          about: "Hey I am " + (result.user!.displayName || ""),
          created_at: Date.now().toString(),
          dateOfBirth: "",
          designation: "Member",
          easyQuestions: 0,
          email: result.user!.email || "",
          follower: 0,
          following: 0,
          gender: "",
          hardQuestions: 0,
          id: userId,
          image: result.user!.photoURL || "",
          isApproved: 0,
          isContentCreator: 0,
          is_online: 0,
          last_active: Date.now().toString(),
          lives: 0,
          mediumQuestions: 0,
          name: result.user!.displayName || "",
          phoneNumber: "",
          place: "",
          profession: "",
          push_token: ""

        };

        await setDoc(userDoc, newUser);

      } else {
        const existingUser = userSnap.data() as User;
        console.log(userId);
        
      }

      const requestDoc = doc(db , 'requests', userId)
      const requestSnap = await getDoc(requestDoc);

      if(!requestSnap.exists()) {
        const newRequest: Request = {
          instagramLink: "",
          isApproved: false,
          isContentCreator: false,
          timeStamp: new Date(),
          userId: userId,
          youtubeLink: "",
        }

        await setDoc(requestDoc , newRequest);
        console.log("request Created");
      }
      else {
        const existingRequest = requestSnap.data() as Request;
        console.log(userId);
        
      }

      // Redirect or show the main content upon successful login
    } catch (error) {
      console.error('Error signing in with Google:', (error as Error).message);
    }
  };

  return (
    <Paper className={classes.authForm} radius="md" p="xl" withBorder {...props}>
      <Text size="lg" fw={500}>
        Welcome to WHILE, {type} with
      </Text>

      <Group grow mb="md" mt="md">
        <GoogleButton onClick={handleGoogleLogin} radius="xl">Google</GoogleButton>
      </Group>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(() => {})}>
        <Stack>
          {type === 'register' && (
            <TextInput
              label="Name"
              placeholder="Your name"
              value={form.values.name}
              onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
              radius="md"
            />
          )}

          <TextInput
            required
            label="Email"
            placeholder="hello@mantine.dev"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email && 'Invalid email'}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
            radius="md"
          />

          {type === 'register' && (
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
            />
          )}
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>
          <Button type="submit" radius="xl">
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
};

export default Auth;