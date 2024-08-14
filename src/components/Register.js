import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Container,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import "./Register.css"; // Import custom CSS

const Register = () => {
  const [formData, setFormData] = useState({
    Username: "",
    Email: "",
    Password: "",
  });

  const [errors, setErrors] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validatePassword = (password) => {
    // Check if password is at least 8 characters long and contains at least one uppercase letter
    const regex = /^(?=.*[A-Z]).{8,}$/;
    return regex.test(password);
  };

  const validateForm = async () => {
    let formErrors = {};
    let valid = true;

    if (!formData.Username) {
      formErrors.Username = "Username is required";
      valid = false;
    }

    if (!formData.Email) {
      formErrors.Email = "Email is required";
      valid = false;
    }

    if (!formData.Password) {
      formErrors.Password = "Password is required";
      valid = false;
    } else if (!validatePassword(formData.Password)) {
      formErrors.Password =
        "Password must be at least 8 characters long and include one uppercase letter";
      valid = false;
    }

    setErrors(formErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (await validateForm()) {
      try {
        const response = await axios.post("/api/register", formData);

        // Retrieve existing users from localStorage
        const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

        // Add the new user if not already present
        const newUser = {
          id: response.data.RandomId, // Use the random ID from the response
          email: formData.Email,
          username: formData.Username,
        };
        existingUsers.push(newUser);
        localStorage.setItem("users", JSON.stringify(existingUsers));

        // Save current user details for session management
        localStorage.setItem("currentUserId", response.data.RandomId);
        localStorage.setItem("username", formData.Username);
        localStorage.setItem("email", formData.Email);

        // Show success toast notification
        toast({
          title: "Registration Successful!",
          description: "Redirecting you to the restaurant info page.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // Clear form data and errors after successful registration
        setFormData({
          Username: "",
          Email: "",
          Password: "",
        });
        setErrors({});

        // Redirect to the restaurant info page after successful registration
        setTimeout(() => {
          navigate("/resturentInfo");
        }, 5000); // Redirect after 5 seconds, matching the toast duration
      } catch (error) {
        console.error("Registration error:", error); // Log error details

        // Update error state based on error response
        const errorMessage =
          error.response?.data?.message ||
          "Registration failed. Please try again.";
        setErrors({ apiError: errorMessage });
        onOpen(); // Open modal to show the API error
      }
    }
  };

  return (
    <Container maxW="lg" centerContent>
      <motion.div
        className="register-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          bg="rgba(255, 255, 255, 0.9)"
          p={8}
          rounded="lg"
          shadow="lg"
          width="100%"
          maxW="500px"
          mx="auto"
        >
          <div className="header">
            <p>Sign up now to become a member.</p>
          </div>
          <Box as="form" onSubmit={handleSubmit}>
            <FormControl isInvalid={!!errors.Username}>
              <FormLabel>Username</FormLabel>
              <Input
                name="Username"
                value={formData.Username}
                onChange={handleChange}
                placeholder="Enter Name"
                required
              />
              {errors.Username && (
                <Text className="error">{errors.Username}</Text>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.Email}>
              <FormLabel>Email</FormLabel>
              <Input
                name="Email"
                type="email"
                value={formData.Email}
                onChange={handleChange}
                placeholder="Enter Email"
                required
              />
              {errors.Email && <Text className="error">{errors.Email}</Text>}
            </FormControl>
            <FormControl isInvalid={!!errors.Password}>
              <FormLabel>Password</FormLabel>
              <Input
                name="Password"
                type="password"
                value={formData.Password}
                onChange={handleChange}
                placeholder="Choose A Password"
                required
              />
              {errors.Password && (
                <Text className="error">{errors.Password}</Text>
              )}
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              className="button"
              mt={4}
              width="full"
            >
              Signup
            </Button>
            {errors.apiError && (
              <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                  <ModalHeader>Error</ModalHeader>
                  <ModalCloseButton />
                  <ModalBody>
                    <Text>{errors.apiError}</Text>
                  </ModalBody>
                </ModalContent>
              </Modal>
            )}
            <Text mt={4} className="footer">
              Already a member? <Link to="/login">Login Here</Link>
            </Text>
          </Box>
        </Box>
      </motion.div>
    </Container>
  );
};

export default Register;
