//
//  UserFeedback.h
//  UserFeedback
//
//  Created by 이승우 on 2018. 3. 19..
//  Copyright © 2018년 이승우. All rights reserved.
//

#import <UIKit/UIKit.h>

//! Project version number for UserFeedback.
FOUNDATION_EXPORT double UserFeedbackVersionNumber;

//! Project version string for UserFeedback.
FOUNDATION_EXPORT const unsigned char UserFeedbackVersionString[];

// In this header, you should import all the public headers of your framework using statements like #import <UserFeedback/PublicHeader.h>


@interface UserFeedback : NSObject
+ (void) setFeedback:(NSString *)userId;
+ (void) showFeedback;
+ (void) putCustom : (NSString *)value  ForKey:(NSString *)forKey;
+ (void) removeCustom : (NSString *)key;

@end
