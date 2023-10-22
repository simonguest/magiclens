import { detectObjects } from "./object-detection/detectObjects";
import { efficientdet_lite0 } from "./object-detection/efficientdet_lite0";
import { efficientdet_lite2 } from "./object-detection/efficientdet_lite2";
import { ssdmobilenet_v2 } from "./object-detection/ssdmobilenet_v2";

import { segment } from "./image-segmentation/segment";
import { selfiesegmenter } from "./image-segmentation/selfiesegmenter";
import { hairsegmenter } from "./image-segmentation/hairsegmenter";
import { selfiemulticlass } from "./image-segmentation/selfiemulticlass";
import { colorSegment} from "./image-segmentation/colorSegment";
import { replaceSegmentWithImage} from "./image-segmentation/replaceSegmentWithImage";

import { detectPose } from "./pose-estimation/detectPose";
import { poselandmarker_lite } from "./pose-estimation/poselandmarker_lite";
import { poselandmarker_full } from "./pose-estimation/poselandmarker_full";
import { poselandmarker_heavy } from "./pose-estimation/poselandmarker_heavy";

export { detectObjects, efficientdet_lite0, efficientdet_lite2, ssdmobilenet_v2 };

export { segment, selfiesegmenter, hairsegmenter, selfiemulticlass, colorSegment, replaceSegmentWithImage };

export { detectPose, poselandmarker_lite, poselandmarker_full, poselandmarker_heavy }