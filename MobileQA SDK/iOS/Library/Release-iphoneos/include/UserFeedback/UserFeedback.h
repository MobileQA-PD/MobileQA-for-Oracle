//
//  UserFeedback.h
//  UserFeedback
//
//  Created by 이승우 on 2018. 8. 15..
//  Copyright © 2018년 이승우. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface UserFeedback : NSObject
+ (void) setFeedback:(NSString *)userId;
+ (void) showFeedback;
+ (void) putCustom : (NSString *)value  ForKey:(NSString *)forKey;
+ (void) removeCustom : (NSString *)key;

@end
