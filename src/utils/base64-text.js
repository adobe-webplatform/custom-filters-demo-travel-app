/*
 * Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/* Module based on requirejs.text to provide ahead of time base64 encoding. */
define(['mobileui/utils/underscore', 'mobileui/utils/text-module', 'mobileui/utils/base64'], function (_, text, base64) {

    var base64_text = _.extend({}, text, {
        encodeContent: base64.encode
    });

    return base64_text;

});
