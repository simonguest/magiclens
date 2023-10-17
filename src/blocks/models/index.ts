import { detectObjects } from "./object-detection/detectObjects";
import { efficientdet_lite0 } from "./object-detection/efficientdet_lite0";
import { efficientdet_lite2 } from "./object-detection/efficientdet_lite2";
import { ssdmobilenet_v2 } from "./object-detection/ssdmobilenet_v2";

import { segment } from "./image-segmentation/segment";
import { selfiesegmenter } from "./image-segmentation/selfiesegmenter";
import { hairsegmenter } from "./image-segmentation/hairsegmenter";
import { selfiemulticlass } from "./image-segmentation/selfiemulticlass";
import { deeplab_v3 } from "./image-segmentation/deeplab_v3";

export { detectObjects, efficientdet_lite0, efficientdet_lite2, ssdmobilenet_v2 };

export { segment, selfiesegmenter, hairsegmenter, selfiemulticlass, deeplab_v3 };