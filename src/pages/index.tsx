// src/pages/index.tsx
import React from 'react';
import { PageConfig, PageProps, Field } from 'jaen';
import { graphql } from 'gatsby';
import { keyframes, css } from '@emotion/react';

import {
  Box,
  Image,
  Container,
  Text,
  HStack,
  VStack,
  Heading,
  Button,
  LinkBox,
  LinkOverlay,
  Flex,
  AspectRatio,
  chakra,
  Link,
  VisuallyHidden
} from '@chakra-ui/react';

import { useScrollSync } from '../hooks/use-scroll-sync';
import useBlogPages from '../hooks/use-blogs';

// Social icons
import { FaInstagram } from '@react-icons/all-files/fa/FaInstagram';
import { FaFacebook } from '@react-icons/all-files/fa/FaFacebook';
import { FaLinkedin } from '@react-icons/all-files/fa/FaLinkedin';
import { FaGithub } from '@react-icons/all-files/fa/FaGithub';
import { FaTiktok } from '@react-icons/all-files/fa6/FaTiktok';

// Sections
import AchivementCounter from '../components/sections/AchivementCounter';
import ChangeCoaching from '../components/sections/ChangeCoaching';
import Psychotherapy from '../components/sections/Psychotherapy';
import NonDisclosure from '../components/sections/NonDisclosure';
import Prices from '../components/sections/Prices';
import Associates from '../components/sections/Associates';
import BlogSlider from '../components/sections/BlogSlider';
import FAQ from '../components/sections/FAQ';
import { GoogleMaps } from '../components/GoogleMaps';

// ------------------------------------
// vCard QR (inline SVG)
// ------------------------------------
const VCARD_QR_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 1155 1155" enable-background="new 0 0 1155 1155" xml:space="preserve">
<rect x="0" y="0" width="1155" height="1155" fill="rgb(255,255,255)"/><g transform="translate(70,70)"><g transform="translate(280,0) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(315,0) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(350,0) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(420,0) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(455,0) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(630,0) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(280,35) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(385,35) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(455,35) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(595,35) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(665,35) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(280,70) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(420,70) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(455,70) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,70) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(630,70) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(700,70) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(315,105) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(385,105) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(455,105) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(595,105) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(665,105) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(700,105) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(280,140) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(350,140) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(420,140) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(455,140) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(490,140) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,140) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(595,140) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(630,140) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(665,140) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(700,140) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(385,175) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(595,175) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(630,175) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(700,175) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(280,210) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(350,210) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(420,210) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(490,210) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,210) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(630,210) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(700,210) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(315,245) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(385,245) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(455,245) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(490,245) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(665,245) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(0,280) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(105,280) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(140,280) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(175,280) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(210,280) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(245,280) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(280,280) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(385,280) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(420,280) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(455,280) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,280) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(595,280) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(735,280) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(840,280) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(910,280) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(945,280) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(980,280) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(35,315) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(70,315) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(280,315) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(315,315) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(350,315) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(385,315) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(420,315) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(455,315) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(490,315) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(525,315) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(630,315) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(665,315) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(735,315) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(805,315) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(840,315) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(910,315) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(945,315) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(0,350) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(70,350) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(105,350) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(175,350) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(210,350) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(245,350) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(350,350) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(385,350) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(455,350) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(525,350) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,350) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(595,350) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(840,350) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(910,350) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(70,385) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(105,385) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(175,385) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(315,385) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(455,385) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(525,385) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(595,385) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(630,385) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(665,385) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(700,385) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(770,385) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(840,385) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(875,385) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(980,385) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(105,420) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(140,420) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(210,420) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(245,420) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(315,420) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(385,420) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(420,420) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(455,420) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(525,420) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(700,420) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(770,420) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(805,420) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(980,420) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(140,455) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(175,455) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(280,455) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(350,455) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(385,455) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(420,455) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(455,455) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(490,455) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(525,455) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,455) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(595,455) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(630,455) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(735,455) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(770,455) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(805,455) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(840,455) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(875,455) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(910,455) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(945,455) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(980,455) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(0,490) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(35,490) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(140,490) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(210,490) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(315,490) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(350,490) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(455,490) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(525,490) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(630,490) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(665,490) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(700,490) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(735,490) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(770,490) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(910,490) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(980,490) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(0,525) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(70,525) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(140,525) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(245,525) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(280,525) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(420,525) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(525,525) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,525) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(665,525) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(700,525) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(735,525) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(805,525) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(910,525) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(980,525) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(70,560) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(105,560) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(175,560) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(210,560) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(245,560) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(315,560) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(350,560) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(420,560) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(490,560) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(525,560) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,560) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(700,560) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(805,560) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(875,560) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(0,595) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(35,595) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(70,595) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(105,595) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(245,595) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(280,595) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(385,595) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(420,595) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(455,595) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(490,595) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(525,595) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(630,595) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(665,595) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(700,595) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(840,595) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(910,595) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(945,595) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(0,630) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(35,630) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(105,630) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(175,630) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(210,630) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(245,630) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(350,630) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(420,630) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(525,630) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(665,630) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(700,630) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(805,630) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(875,630) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(980,630) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(0,665) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(35,665) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(70,665) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(140,665) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(175,665) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(245,665) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(315,665) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(350,665) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(385,665) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(490,665) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,665) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(630,665) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(770,665) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(805,665) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(875,665) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(910,665) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(0,700) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(35,700) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(70,700) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(210,700) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(280,700) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(385,700) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(420,700) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(455,700) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(490,700) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(525,700) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(595,700) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(700,700) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(735,700) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(770,700) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(805,700) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(840,700) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(875,700) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(910,700) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(945,700) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(280,735) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(490,735) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(525,735) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(630,735) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(700,735) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(840,735) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(875,735) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(280,770) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(420,770) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(490,770) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(525,770) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,770) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(595,770) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(665,770) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(700,770) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(770,770) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(840,770) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(875,770) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(280,805) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(315,805) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(490,805) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,805) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(595,805) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(700,805) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(840,805) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(280,840) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(315,840) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(350,840) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(455,840) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(490,840) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(525,840) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,840) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(630,840) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(665,840) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(700,840) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(735,840) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(770,840) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(805,840) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(840,840) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(875,840) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(980,840) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(280,875) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(315,875) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(385,875) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(525,875) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,875) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(595,875) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(630,875) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(735,875) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(980,875) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(385,910) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(490,910) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(525,910) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,910) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(665,910) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(700,910) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(735,910) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(840,910) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(910,910) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(945,910) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(980,910) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(315,945) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(350,945) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(420,945) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(560,945) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(735,945) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(770,945) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(805,945) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(875,945) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(910,945) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(980,945) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(280,980) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(315,980) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(420,980) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(490,980) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(665,980) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(700,980) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(805,980) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(840,980) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(875,980) scale(0.35,0.35)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(0,0) scale(2.45, 2.45)"><g transform="" style="fill: rgb(0, 0, 0);">
<g>
	<rect x="15" y="15" style="fill:none;" width="70" height="70"/>
	<path d="M85,0H15H0v15v70v15h15h70h15V85V15V0H85z M85,85H15V15h70V85z"/>
</g>
</g></g><g transform="translate(770,0) scale(2.45, 2.45)"><g transform="" style="fill: rgb(0, 0, 0);">
<g>
	<rect x="15" y="15" style="fill:none;" width="70" height="70"/>
	<path d="M85,0H15H0v15v70v15h15h70h15V85V15V0H85z M85,85H15V15h70V85z"/>
</g>
</g></g><g transform="translate(0,770) scale(2.45, 2.45)"><g transform="" style="fill: rgb(0, 0, 0);">
<g>
	<rect x="15" y="15" style="fill:none;" width="70" height="70"/>
	<path d="M85,0H15H0v15v70v15h15h70h15V85V15V0H85z M85,85H15V15h70V85z"/>
</g>
</g></g><g transform="translate(70,70) scale(1.05, 1.05)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(840,70) scale(1.05, 1.05)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g><g transform="translate(70,840) scale(1.05, 1.05)"><g transform="" style="fill: rgb(0, 0, 0);">
<rect width="100" height="100"/>
</g></g></g></svg>
`

// ------------------------------------
// Animations
// ------------------------------------
const move = keyframes`
  0% { transform: translate(0, -50%); }
  100% { transform: translate(0, 0); }
`;

const blob = keyframes`
  0% { transform: translate(-6%, -4%) scale(1); }
  38% { transform: translate(8%, -10%) scale(1.05); }
  72% { transform: translate(-4%, 6%) scale(1.08); }
  100% { transform: translate(6%, 2%) scale(1.12); }
`;

const sheen = keyframes`
  0% { transform: translateX(-120%) rotate(15deg); }
  100% { transform: translateX(120%) rotate(15deg); }
`;

// ------------------------------------
// Integrated styles from style.ts
// ------------------------------------
const parallaxMake = (parallaxLayers: number, speedFactor: number = 1) => {
  const styles: Record<string, any> = {};
  for (let i = 0; i <= parallaxLayers; i++) {
    const x = (parallaxLayers - i) / 2;
    styles[`.parallax__layer__${i}`] = {
      top: i === 0 ? '-150%' : '0',
      transform: `translateZ(${-100 * x * speedFactor}px) scale(${x + 1})`,
      transformOrigin: 'center'
    };
  }
  return styles;
};

const Section = (noScroll?: boolean) => css`
  perspective: 100px;
  overflow-x: hidden;
  overflow-y: ${noScroll ? 'scroll' : 'hidden'};
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  /* prevent margin-top on layer 6 from collapsing with parent */
  display: flow-root;

  .parallax__layer {
    position: absolute;
    inset: 0;
  }

  /* Decorative layers are click-through; keep 2 and 6 interactive */
  .parallax__layer:not(.parallax__layer__2):not(.parallax__layer__6) {
    pointer-events: none;
  }

  /* White content section: sits in normal flow below the reveal offset */
  .parallax__layer__6 {
    position: relative;
    z-index: 2;
    /* 88vh on base (12vh navbar), 85vh on md+ (15vh navbar), never less than 100px navbar */
    margin-top: calc(120vh - max(var(--navbar-vh, 15vh), 100px));
    /* cancel any parallax transform and absolute geometry */
    transform: none;
  }

  .parallax__cover {
    background: #fff;
    display: flex;
    align-items: flex-end;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  ${parallaxMake(7, 1)}

  @keyframes scrollarrows {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

// ------------------------------------
// ScrollArrows component
// ------------------------------------
interface ScrollArrowsProps {
  isVisible: boolean;
}
const ScrollArrows: React.FC<ScrollArrowsProps> = ({ isVisible }) => (
  <Box
    alignSelf="flex-end"
    h="100px"
    opacity={isVisible ? '1' : '0'}
    transition="opacity 0.5s ease-in-out"
    position="relative"
    pointerEvents="none"
  >
    {Array.from({ length: 3 }, (_, index) => (
      <Box
        key={index}
        position="absolute"
        left="50%"
        top={`${index * 16}px`}
        w="24px"
        h="24px"
        animation={`scrollarrows 2s infinite ${index * 0.15}s`}
        opacity="0"
        borderRadius="sm"
        borderLeft="1px solid #7f188c"
        borderBottom="1px solid #7f188c"
        boxShadow="-2px 2px 2px rgba(0, 0, 0, 0.1)"
        transform="translateX(-50%) rotate(-45deg)"
      />
    ))}
  </Box>
);

// ------------------------------------
// vCard QR component (renders VCARD_QR_SVG)
// ------------------------------------
const VCardQR: React.FC = () => (
  <Box
    aria-label="vCard QR"
    role="img"
    w={{ base: '88px', md: '110px' }}
    h={{ base: '88px', md: '110px' }}
    p="2"
    bg="white"
    border="1px solid"
    borderColor="whiteAlpha.400"
    borderRadius="lg"
    boxShadow="0 6px 22px rgba(0,0,0,0.28)"
    display="grid"
    placeItems="center"
    overflow="hidden"
  >
    <Box
      as="span"
      display="block"
      w="full"
      h="full"
      // paste your big inline SVG into VCARD_QR_SVG above
      dangerouslySetInnerHTML={{ __html: VCARD_QR_SVG }}
    />
  </Box>
);

const IndexPage: React.FC<PageProps> = () => {
  const { ref } = useScrollSync(0);
  const blogIndex = useBlogPages();

  const BRAND = {
    base: '#18011a',
    accent: '#7f188c',
    white: '#ffffffff',
    gridLine: 'rgba(127, 24, 140, 0.65)',
    gridGlow: 'rgba(127, 24, 140, 0.65)'
  };

  const MODERN_FONT =
    "'Plus Jakarta Sans', Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji'";

  return (
    <>
      <Box
        className="parallax"
        css={Section()}
        ref={ref}
        /* Define navbar height var responsively (12vh base, 15vh md+) */
        sx={
          {
            '--navbar-vh': '12vh',
            '@media (min-width: 48em)': {
              '--navbar-vh': '15vh'
            }
          } as React.CSSProperties
        }
      >
        {/* BACKDROP LAYER */}
        <Box
          className="parallax__layer parallax__layer__0"
          display="flex"
          h="160vh"
          alignItems="center"
          justifyContent="center"
          overflow="hidden"
          m={0}
          pos="relative"
          pointerEvents="none"
          sx={{
            perspective: '100vmax',
            background: `
              radial-gradient(120% 70% at 50% 0%,
                rgba(127,24,140,0.25) 0%,
                rgba(127,24,140,0.08) 40%,
                rgba(24,1,26,0) 70%
              ),
              ${BRAND.base}
            `
          }}
        >
          <Box
            pos="relative"
            h="150vh"
            w="100vw"
            transform="scale(1)"
            sx={{ transformStyle: 'preserve-3d' }}
          >
            {/* WALL */}
            <Box
              pos="absolute"
              zIndex={0}
              sx={{
                inset: 0,
                '--grid-color': BRAND.gridLine,
                '--grid-weight': '1px',
                '--grid-spacing': '3.65vmax',
                '--grid-glow': '2px',
                '--grid-glow-color': BRAND.gridGlow,
                '--grid-col': 'var(--grid-spacing)',
                '--grid-row': 'calc(var(--grid-col) * 4 / 3)',
                backgroundPosition: '50% 50%, 50% 50%, 50% 50%, 50% 50%',
                backgroundSize:
                  'var(--grid-row) var(--grid-row), var(--grid-row) var(--grid-row), var(--grid-col) var(--grid-col), var(--grid-col) var(--grid-col)',
                backgroundImage: `
                  repeating-linear-gradient(
                    0deg, var(--grid-color), var(--grid-color) var(--grid-weight),
                    transparent var(--grid-weight), transparent var(--grid-row)
                  ),
                  repeating-linear-gradient(
                    0deg, var(--grid-glow-color), var(--grid-glow-color) var(--grid-weight),
                    transparent calc(var(--grid-weight) + var(--grid-glow)),
                    transparent calc(var(--grid-row) - var(--grid-glow)),
                    var(--grid-glow-color) var(--grid-row)
                  ),
                  repeating-linear-gradient(
                    -90deg, var(--grid-color), var(--grid-color) var(--grid-weight),
                    transparent var(--grid-weight), transparent var(--grid-col)
                  ),
                  repeating-linear-gradient(
                    -90deg, var(--grid-glow-color), var(--grid-glow-color) var(--grid-weight),
                    transparent calc(var(--grid-weight) + var(--grid-glow)),
                    transparent calc(var(--grid-col) - var(--grid-glow)),
                    var(--grid-glow-color) var(--grid-col)
                  )
                `,
                backgroundBlendMode: 'screen',
                transform: 'translateZ(-45vmax) scale(1.6)',
                maskImage:
                  'linear-gradient(to top, rgba(0,0,0,0.98) 12%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0) 100%)',
                WebkitMaskImage:
                  'linear-gradient(to top, rgba(0,0,0,0.98) 12%, rgba(0,0,0,0.75) 45%, rgba(0,0,0,0.25) 75%, rgba(0,0,0,0) 100%)'
              }}
            />

            {/* FLOOR */}
            <Box
              bg={BRAND.base}
              pos="absolute"
              top="50%"
              left="50%"
              h="100vmax"
              w="180vw"
              transform="translate(-50%, -50%) rotate3d(1, 0, 0, 75deg) translate3d(0, 25%, 0)"
              display="flex"
              alignItems="center"
              justifyContent="center"
              fontSize="30vmin"
              overflow="hidden"
              zIndex={1}
              sx={{
                willChange: 'transform',
                '--grid-color': BRAND.gridLine,
                '--grid-weight': '1.1px',
                '--grid-spacing': '5vmax',
                '--grid-glow': '2.5px',
                '--grid-glow-color': BRAND.gridGlow,
                '--grid-col': 'var(--grid-spacing)',
                '--grid-row': 'calc(var(--grid-col) * 4 / 3)',
                textShadow: `
                  0 0 1px ${BRAND.white},
                  0 0 3px ${BRAND.white},
                  0 0 8px var(--grid-color)
                `,
                '&::before': {
                  content: '""',
                  zIndex: -1,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '200%',
                  width: '100%',
                  backgroundPosition: '50% 50%, 50% 50%, 50% 50%, 50% 50%',
                  backgroundSize:
                    'var(--grid-row) var(--grid-row), var(--grid-row) var(--grid-row), var(--grid-col) var(--grid-col), var(--grid-col) var(--grid-col)',
                  backgroundImage: `
                    repeating-linear-gradient(
                      0deg, var(--grid-color), var(--grid-color) var(--grid-weight),
                      transparent var(--grid-weight), transparent var(--grid-row)
                    ),
                    repeating-linear-gradient(
                      0deg, var(--grid-glow-color), var(--grid-glow-color) var(--grid-weight),
                      transparent calc(var(--grid-weight) + var(--grid-glow)),
                      transparent calc(var(--grid-row) - var(--grid-glow)),
                      var(--grid-glow-color) var(--grid-row)
                    ),
                    repeating-linear-gradient(
                      -90deg, var(--grid-color), var(--grid-color) var(--grid-weight),
                      transparent var(--grid-weight), transparent var(--grid-col)
                    ),
                    repeating-linear-gradient(
                      -90deg, var(--grid-glow-color), var(--grid-glow-color) var(--grid-weight),
                      transparent calc(var(--grid-weight) + var(--grid-glow)),
                      transparent calc(var(--grid-col) - var(--grid-glow)),
                      var(--grid-glow-color) var(--grid-col)
                    )
                  `,
                  backgroundBlendMode: 'screen',
                  animation: `${move} 20s linear infinite`,
                  pointerEvents: 'none'
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background:
                    'radial-gradient(120% 60% at 50% 0%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.0) 55%)',
                  pointerEvents: 'none'
                }
              }}
            />
          </Box>
        </Box>

        {/* CONTENT LAYER */}
        <Box className="parallax__layer parallax__layer__2" position="relative">
          <Container maxW="7xl" pt={{ base: 6, md: 10 }}>
            <Flex
              direction={{ base: 'column', md: 'row' }}
              align={{ base: 'center', md: 'stretch' }}
              gap={{ base: 6, md: 10 }}
              justify="space-between"
            >
              {/* Mobile: circular avatar link */}
              <LinkBox
                as="article"
                display={{ base: 'block', md: 'none' }}
                position="relative"
              >
                <LinkOverlay href="/blog" aria-label="Zum Blog" />
                <Box
                  position="relative"
                  w="140px"
                  h="140px"
                  borderRadius="full"
                  overflow="hidden"
                  border="2px solid rgba(255,255,255,0.35)"
                  boxShadow="0 10px 30px rgba(0,0,0,0.35)"
                >
                  {/* Fill container with editable image */}
                  <Box position="absolute" inset={0}>
                    <Field.Image
                      name="HeroPortraitImage"
                      defaultValue="/content/IMG_3038.jpg"
                      alt="Nadine Hauswirth, Psychotherapeutin"
                      objectFit="cover"
                    />
                  </Box>
                  <Box
                    position="absolute"
                    inset={0}
                    bgGradient="linear(to-br, rgba(255,255,255,0.18), rgba(255,255,255,0))"
                  />
                </Box>
              </LinkBox>

              {/* Desktop: framed portrait link */}
              <LinkBox
                as="article"
                display={{ base: 'none', md: 'block' }}
                flexBasis={{ md: '380px', lg: '420px' }}
                alignSelf={{ md: 'flex-start' }}
                position="relative"
              >
                <LinkOverlay
                  href="/blog"
                  aria-label="Zum Blog"
                  _hover={{ textDecoration: 'none' }}
                />
                <Box
                  p="2px"
                  borderRadius="28px"
                  transition="transform 0.3s ease, box-shadow 0.3s ease"
                  bgGradient={`linear(to-br, ${BRAND.accent}, rgba(255,255,255,0.9))`}
                  boxShadow="0 16px 60px rgba(127,24,140,0.35)"
                  _hover={{
                    transform: 'translateY(-4px)',
                    boxShadow: '0 24px 80px rgba(127,24,140,0.5)'
                  }}
                  maxW="420px"
                  w="full"
                >
                  <Box
                    bg={BRAND.base}
                    borderRadius="26px"
                    border="1px solid"
                    borderColor="rgba(255,255,255,0.28)"
                    p="10px"
                    overflow="hidden"
                    position="relative"
                    _before={{
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      pointerEvents: 'none',
                      borderRadius: '22px',
                      boxShadow:
                        'inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -20px 40px rgba(0,0,0,0.25)'
                    }}
                  >
                    <AspectRatio ratio={5 / 6} w="full">
                      {/* Fill container with editable image */}
                      <Box position="absolute" inset={0}>
                        <Field.Image
                          name="HeroPortraitImage"
                          defaultValue="/content/IMG_3038.jpg"
                          alt="Nadine Hauswirth, Psychotherapeutin"
                          objectFit="cover"
                        />
                      </Box>
                    </AspectRatio>
                  </Box>
                </Box>
              </LinkBox>

              {/* Liquid Glass Panel */}
              <Box
                flex="1"
                maxW={{ base: '720px', lg: '820px' }}
                w="full"
                position="relative"
                borderRadius="2xl"
                px={{ base: 5, md: 8 }}
                py={{ base: 6, md: 8 }}
                bg="rgba(255,255,255,0.06)"
                border="1px solid rgba(255,255,255,0.22)"
                boxShadow="0 16px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.22)"
                backdropFilter="blur(16px) saturate(130%)"
                sx={{
                  WebkitBackdropFilter: 'blur(16px) saturate(130%)',
                  overflow: 'hidden',
                  isolation: 'isolate',
                  textRendering: 'optimizeLegibility',
                  WebkitFontSmoothing: 'antialiased',
                  MozOsxFontSmoothing: 'grayscale',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: '-20%',
                    background: `radial-gradient(40% 40% at 20% 10%, rgba(127,24,140,0.28) 0%, rgba(127,24,140,0.00) 60%),
                       radial-gradient(35% 35% at 80% 30%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.00) 60%),
                       radial-gradient(50% 50% at 60% 80%, rgba(127,24,140,0.18) 0%, rgba(127,24,140,0.00) 60%)`,
                    filter: 'blur(24px)',
                    animation: `${blob} 36s ease-in-out infinite`,
                    zIndex: -2,
                    pointerEvents: 'none',
                    mixBlendMode: 'screen'
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '-30%',
                    left: '-10%',
                    width: '140%',
                    height: '200%',
                    background:
                      'linear-gradient(120deg, rgba(255,255,255,0) 45%, rgba(255,255,255,0.24) 50%, rgba(255,255,255,0) 55%)',
                    animation: `${sheen} 18s linear infinite`,
                    pointerEvents: 'none',
                    zIndex: -1
                  }
                }}
              >
                <Box position="relative" zIndex={1}>
                  <VStack align="flex-start" spacing={{ base: 4, md: 5 }}>
                    <Heading
                      as="h1"
                      fontFamily={MODERN_FONT}
                      fontWeight="800"
                      letterSpacing="-0.02em"
                      fontSize={{ base: '2xl', md: '3xl' }}
                      lineHeight="1.15"
                      color={BRAND.white}
                    >
                      <Field.Text
                        as={chakra.span}
                        name="HeroTitle"
                        defaultValue="COACHING &amp; PSYCHOTHERAPIE"
                      />
                    </Heading>

                    <Text
                      fontFamily={MODERN_FONT}
                      fontWeight="500"
                      letterSpacing="0.01em"
                      fontSize={{ base: 'md', md: 'lg' }}
                      color="whiteAlpha.900"
                      maxW="60ch"
                    >
                      <Field.Text
                        as={chakra.span}
                        name="HeroLead"
                        defaultValue="Nadine Hauswirth, BA. Pth – Psychotherapeutin in Ausbildung unter Supervision und Psychoanalyse in Wien"
                      />
                    </Text>

                    <HStack spacing={3} pt={1} flexWrap="wrap" alignItems="center" w="full">
                      {/* CTAs → open ?contact */}
                      <Button
                        as={Link}
                        href="?contact"
                        size="md"
                        variant="outline"
                        borderRadius="full"
                        borderColor={BRAND.white}
                        color={BRAND.white}
                        _hover={{ bg: 'whiteAlpha.100' }}
                        _focusVisible={{ boxShadow: '0 0 0 3px rgba(127,24,140,0.45)' }}
                      >
                        Kontakt
                      </Button>
                      <Button
                        as={Link}
                        href="?contact"
                        size="md"
                        borderRadius="full"
                        bg={BRAND.accent}
                        color="white"
                        _hover={{ filter: 'brightness(1.1)' }}
                        _focusVisible={{ boxShadow: '0 0 0 3px rgba(127,24,140,0.45)' }}
                      >
                        Termin buchen
                      </Button>

                      {/* Spacer to push QR+social right on md+ */}
                      <Box flexGrow={{ base: 0, md: 1 }} />

                      {/* vCard QR (inline SVG) */}
                      <VCardQR />

                      {/* Socials */}
                      <HStack spacing={3} pl={{ base: 0, md: 2 }}>
                        <Link href="#" isExternal aria-label="TikTok">
                          <VisuallyHidden>TikTok</VisuallyHidden>
                          <Box as={FaTiktok} boxSize="22px" color="whiteAlpha.900" />
                        </Link>
                        <Link href="#" isExternal aria-label="LinkedIn">
                          <VisuallyHidden>LinkedIn</VisuallyHidden>
                          <Box as={FaLinkedin} boxSize="22px" color="whiteAlpha.900" />
                        </Link>
                        <Link href="#" isExternal aria-label="Instagram">
                          <VisuallyHidden>Instagram</VisuallyHidden>
                          <Box as={FaInstagram} boxSize="22px" color="whiteAlpha.900" />
                        </Link>
                        <Link href="#" isExternal aria-label="Facebook">
                          <VisuallyHidden>Facebook</VisuallyHidden>
                          <Box as={FaFacebook} boxSize="22px" color="whiteAlpha.900" />
                        </Link>
                        <Link href="#" isExternal aria-label="GitHub">
                          <VisuallyHidden>GitHub</VisuallyHidden>
                          <Box as={FaGithub} boxSize="22px" color="whiteAlpha.900" />
                        </Link>
                      </HStack>
                    </HStack>
                  </VStack>
                </Box>

                {/* Decorative SVG overlay */}
                <chakra.svg
                  viewBox="0 0 800 600"
                  position="absolute"
                  inset={0}
                  w="full"
                  h="full"
                  opacity={0.6}
                  style={{ mixBlendMode: 'soft-light', pointerEvents: 'none' }}
                  zIndex={0}
                >
                  <defs>
                    <linearGradient id="g-accent" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0" stopColor={BRAND.accent} stopOpacity="0.45" />
                      <stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
                    </linearGradient>
                    <filter id="blur40" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
                    </filter>
                  </defs>

                  <circle cx="140" cy="90" r="220" fill="url(#g-accent)" filter="url(#blur40)" />
                  <circle cx="680" cy="180" r="180" fill="url(#g-accent)" filter="url(#blur40)" />
                  <circle cx="480" cy="520" r="220" fill="url(#g-accent)" filter="url(#blur40)" />

                  {[140, 220, 300, 380, 460].map((y, i) => (
                    <path
                      key={y}
                      d={`M0 ${y} Q 150 ${y - 20}, 300 ${y} T 600 ${y} T 900 ${y}`}
                      fill="none"
                      stroke={`rgba(255,255,255,${0.1 + i * 0.05})`}
                      strokeWidth="1"
                    />
                  ))}
                </chakra.svg>
              </Box>
            </Flex>
          </Container>
          {/* Scroll arrows — bottom center */}
          <ScrollArrows isVisible={true} />
        </Box>

        {/* WHITE CONTENT AREA BELOW (flow content; margin-top creates the reveal) */}
        <Box className="parallax__layer parallax__layer__6">
          <Box position="relative">
            <Box h="100%" mt={{ base: 8, md: 16 }}>
              <Box pt="20" bg="white">
                <AchivementCounter
                  items={[
                    { label: 'Jahre', value: 5, suffix: '+' },
                    { label: 'Therapien', value: 500, suffix: '+' },
                    { label: 'Coachings', value: 900, suffix: '+' }
                  ]}
                />

                <ChangeCoaching />
                <Psychotherapy accentColor="#7f188c" />
                <NonDisclosure accentColor="#7f188c" />
                <Prices accentColor="#7f188c" />
                <Associates />
                <BlogSlider blogIndex={blogIndex} />
                <FAQ />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <GoogleMaps
        objectFit="cover"
        h="full"
        w="100%"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2658.943210509323!2d16.39061507721271!3d48.20770977125128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476d0712a8ac8f77%3A0xefb15b7a09edac54!2sL%C3%B6wengasse%2028%2F22%2C%201030%20Wien!5e0!3m2!1sen!2sat!4v1748983411247!5m2!1sen!2sat"
      />
    </>
  );
};

export default IndexPage;

export const pageConfig: PageConfig = {
  label: 'Home Page',
  icon: 'FaHome',
  childTemplates: ['BlogPage']
};

export const query = graphql`
  query ($jaenPageId: String!) {
    ...JaenPageQuery
    allJaenPage {
      nodes {
        ...JaenPageData
        children {
          ...JaenPageData
        }
        childPages {
          ...JaenPageChildrenData
          sections {
            fieldName
            items {
              id
              jaenFields
            }
          }
        }
      }
    }
  }
`;

export { Head } from 'jaen';
