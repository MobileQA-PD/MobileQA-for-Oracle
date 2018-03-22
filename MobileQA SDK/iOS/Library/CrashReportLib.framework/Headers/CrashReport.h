//
//  CrashReport.h
//  CrashReportLib
//
//  Created by 이승우 on 2018. 3. 9..
//  Copyright © 2018년 이승우. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface CrashReport : NSObject
+ (void) setCrashReport:(NSString *)id;
+ (void) putCustom : (NSString *)value  ForKey:(NSString *)forKey;
+ (void) removeCustom : (NSString *)key;

+ (Boolean) hasExceptionLog;
+ (void) saveExceptionLog : (NSException *)exception folderId:(NSString *)folderId;
+ (void) removeExceptionLog;
+ (NSString *) loadExceptionLog;
+ (NSString *) getFilePath;
+ (NSString *) getExceptionLogString : (NSException *)exception  folderId:(NSString *)folderId;
@end
