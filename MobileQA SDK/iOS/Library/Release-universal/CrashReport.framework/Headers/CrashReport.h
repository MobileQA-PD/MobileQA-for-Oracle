//
//  CrashReport.h
//  CrashReport
//
//  Created by 이승우 on 2018. 8. 17..
//  Copyright © 2018년 이승우. All rights reserved.
//

#import <UIKit/UIKit.h>

//! Project version number for CrashReport.
FOUNDATION_EXPORT double CrashReportVersionNumber;

//! Project version string for CrashReport.
FOUNDATION_EXPORT const unsigned char CrashReportVersionString[];

// In this header, you should import all the public headers of your framework using statements like #import <CrashReport/PublicHeader.h>


@interface CrashReport : NSObject
+ (void) setCrashReport:(NSString *)id;
+ (void) postCustomCrash:(NSString *)title
              Descrition:(NSString *)description
        CompletionHander:(void (^)(int response, NSString *description))completionHandler;

+ (void) putCustom : (NSString *)value  ForKey:(NSString *)forKey;
+ (void) removeCustom : (NSString *)key;

@end
