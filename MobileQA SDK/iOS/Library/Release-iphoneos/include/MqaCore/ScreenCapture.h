//
//  ScreenCapture.h
//  MqaCore
//
//  Created by 이승우 on 2018. 3. 19..
//  Copyright © 2018년 이승우. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@interface ScreenCapture : NSObject
+ (UIImage *) takeScreenShot;
+ (UIImage *) resizeImage:(UIImage *)image Ratio:(float)ratio;
+ (NSString *)encodeToBase64String:(UIImage *)image;
@end
