//
//  CrashReport.h
//  CrashReportLib
//
//  Created by 이승우 on 2018. 3. 9..
//  Copyright © 2018년 이승우. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <WebKit/WebKit.h>


@interface CrashReport : NSObject 
+ (void) setCrashReport:(NSString *)id;
+ (void) postCustomCrash:(NSString *)title
              Descrition:(NSString *)description
        CompletionHander:(void (^)(int response, NSString *description))completionHandler;

+ (void) putCustom : (NSString *)value  ForKey:(NSString *)forKey;
+ (void) removeCustom : (NSString *)key;

@end
